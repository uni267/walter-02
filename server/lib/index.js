import express from "express";
import bodyParser from "body-parser";
// import morgan from "morgan";
import path from "path";
import log4js from "log4js";
import { EventEmitter } from "events";
import logger from "./logger";
import router from "./routes";
import { checkMongo, checkSwift, checkElastic, checkKafka, checkTika, getApiPort } from "./checkServices";


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

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '300mb'}));
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
