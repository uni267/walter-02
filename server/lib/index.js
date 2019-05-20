import express from "express";
import bodyParser from "body-parser";
// import morgan from "morgan";
import path from "path";
import log4js from "log4js";
import { EventEmitter } from "events";
import logger from "./logger";
import router from "./routes";
import { checkMongo, checkSwift, checkElastic, checkKafka, checkTika, getApiPort } from "./checkServices";


import * as constants from "./configs/constants";
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

//app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json({limit: '300mb'}));

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
app.use(log4js.connectLogger(logger, {
  level: 'info',
  format: (req, res, format) => ({
    "remote-addr": format(":remote-addr"),
    "user_id": res.user ? res.user._id : res.user,
    "method": format(":method"),
    "url": format(":url"),
    "referrer": format(":referrer"),
    "user-agent": format(":user-agent"),
  })
}));

const event = new EventEmitter;
const status = {};

// mongo, swift, elasticsearch, kafka, tikaのヘルスチェックが完了通知を受け取ったらappを起動する
event.on("success", middleware_name => {
  status[middleware_name] = true;
  
  if (status.mongo && status.swift && status.elastic &&  status.kafka &&  status.tika) {
    const port = getApiPort()
    const server = app.listen(port, () => {
      console.log(`start server port: ${port}`);
    });

    app.use("/", router);
  }
});

const process_checked = middleware_name => {
  return () => {
    console.log(`${middleware_name} connection success`);
    logger.info(`${middleware_name} connection success`);
    event.emit("success", middleware_name);
  }
}

try {
  checkMongo(process_checked('mongo'));
  checkSwift(process_checked('swift'));
  checkElastic(process_checked('elastic'));
  checkTika(process_checked('tika'));  //全文検索オプションがONの時
  checkKafka(process_checked('kafka'));
} catch (e) {
  logger.error(e);
  process.exit();
}
