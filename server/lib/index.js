import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import morgan from "morgan";
import path from "path";
import log4js from "log4js";
import { EventEmitter } from "events";
import logger from "./logger";
import { SERVER_CONF } from "./configs/server"; // mongoのipなど
import router from "./routes";
import * as constants from "./configs/constants";
import { Swift } from "./storages/Swift";
import esClient from "./elasticsearchclient";
import fs from "fs";
import crypto from "crypto";
import request from "superagent";
import util from "util";
import fileType from "file-type";
const app = express();

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods",
             "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cache-Control", "no-store");
  next();
});

// ie11にてファイルサイズが大きい場合、メモリオーバーになる対策
const streamMiddleware = (req, res, next) => {
  if (req.headers["x-cloud-storage-use-stream"] === "1" && req.method === "POST") {

    const uuid = req.headers["x-file-uuid"];
    const tmpPath = `/tmp/${uuid}.bin`;
    const ws = fs.createWriteStream(tmpPath, {flags: "a"});

    ws.on("close", () => {
      const stats = fs.statSync(tmpPath);
      const fileSize = parseInt(req.headers["x-file-size"]);
      
      if (stats.size === fileSize) {
        // @todo nextハンドラに渡す際にread streamで渡す方法が判れば...
        const buff = fs.readFileSync(tmpPath);
        res.blobBody = buff;
        next();
      } else if (stats.size < fileSize){
        // 残りのチャンクが存在する場合
        res.json(false);
      } else {
        res.status(500).json({error: "一時ファイルのサイズが元ファイルよりも大きくなっています"});
      }
    });

    req.on("data", chunk => {
      ws.write(chunk);
    });
    req.on("end", () => {
      ws.end();
    });
    
  } else {
    next();
  }
};

// ファイルのblobからmime_typeを取得する
const getMimeType = buff => {
  const type = fileType(buff.slice(0,fileType.minimumBytes));
  return type === null ? "application/octet-stream" : type.mime;
};

app.use("/api/v1/files/binary", streamMiddleware, (req, res, next) => {
  let mime_type = req.headers["x-file-mime-type"] === "" ||
      req.headers["x-file-mime-type"] === null ||
      req.headers["x-file-mime-type"] === undefined
      ? getMimeType(res.blobBody)
      : req.headers["x-file-mime-type"];

  const base64Body = "data:" + mime_type + ";base64," + res.blobBody.toString("base64");
  const checksum = crypto.createHash("md5").update(new Buffer(base64Body)).digest("hex");
  const fileNameBuffer = new Buffer(req.headers["x-file-name"], "base64");

  const requestBody = {
    files: [{
      name: fileNameBuffer.toString("utf8"),
      mime_type: mime_type,
      size: parseInt(req.headers["x-file-size"]),
      base64: base64Body,
      checksum
    }],
    dir_id: req.headers["x-dir-id"]
  };
  
  request
    .post("http://localhost:3333/api/v1/files")
    .set("X-Auth-Cloud-Storage", req.headers["x-auth-cloud-storage"])
    .send(requestBody)
    .end( (err, payload) => {
      res.json(payload.body);
    });
});

app.use(bodyParser.urlencoded({limit: constants.FILE_MAX_UPLOAD_SIZE, extended: true}));
app.use(bodyParser.json({limit: constants.FILE_MAX_UPLOAD_SIZE }));
// app.use(morgan({ format: "dev", immediate: true }));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(log4js.connectLogger(logger));

// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
const mode = process.env.NODE_ENV;

let url;
let db_name;
let port;

switch (mode) {
case "integration":
  url = SERVER_CONF.integration.url;
  db_name = SERVER_CONF.integration.db_name;
  port = SERVER_CONF.integration.port;
  break;

case "production":
  if (! process.env.MONGO_HOST_NAME) throw new Error("env.MONGO_HOST_NAME is not set");

  url = SERVER_CONF.production.url;
  db_name = SERVER_CONF.production.db_name;
  port = SERVER_CONF.production.port;
  break;

default:
  url = SERVER_CONF.development.url;
  db_name = SERVER_CONF.development.db_name;
  port = SERVER_CONF.development.port;
  break;
}

const event = new EventEmitter;
const status = {};

// mongo, swift, elasticsearchのヘルスチェックが完了通知を受け取ったらappを起動する
event.on("success", middleware_name => {
  status[middleware_name] = true;

  if (status.mongo && status.swift && status.elastic) {
    const server = app.listen(port, () => {
      console.log(`start server port: ${port}`);
      logger.info(`start server port: ${port}`);
    });

    app.use("/", router);
  }
});

mongoose.Promise = global.Promise;

const checkMongo = (count = 0) => {
  mongoose.connect(`${url}/${db_name}`, {useMongoClient: true}).then( res => {
    console.log("mongo connection success");
    logger.info("mongo connection success");
    event.emit("success", "mongo");
  }).catch( e => {
    console.log("mongo connection failed", count + 1);
    logger.info("mongo connection failed", count + 1);

    setTimeout( () => {
      if (constants.MONGO_CONNECTION_RETRY <= count) throw new Error("mongodb connection failed");
      checkMongo(count + 1);
    }, constants.MONGO_CONNECTION_INTERVAL);
  });
};

const checkSwift = (count = 0) => {
  const swift = new Swift();

  swift.getContainers().then( res => {
    console.log("swift connection success");
    logger.info("swift connection success");
    event.emit("success", "swift");
  }).catch( e => {
    console.log("swift connection failed", count + 1);
    logger.info("swift connection failed", count + 1);

    if (constants.SWIFT_CONNECTION_RETRY <= count) throw new Error("swift connection failed");

    setTimeout( () => {
      checkSwift(count + 1);
    }, constants.SWIFT_CONNECTION_INTERVAL);

  });
};

const checkElastic = (count = 0) => {
  esClient.ping({ requestTimeout: constants.ELASTIC_CONNECTION_TIMEOUT }, err => {
    if (err) {
      console.log("elasticsearch connection failed", count + 1);
      logger.info("elasticsearch connection failed", count + 1);

      if (constants.ELASTIC_CONNECTION_RETRY <= count) throw new Error("elasticsearch connection failed");

      setTimeout( () => {
        checkElastic(count + 1);
      }, constants.ELASTIC_CONNECTION_INTERVAL );

    }
    else {
      console.log("elasticsearch connection success");
      logger.info("elasticsearch connection success");
      event.emit("success", "elastic");
    }
  });
};

try {
  checkMongo();
  checkSwift();
  checkElastic();
} catch (e) {
  logger.error(e);
  process.exit();
}
