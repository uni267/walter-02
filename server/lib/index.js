import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import log4js from "log4js";
import logger from "./logger";

import { SERVER_CONF } from "../configs/server"; // mongoのipなど
import router from "./routes";
import * as constants from "../configs/constants";

const app = express();

app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods",
             "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers",
             "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(morgan({ format: "dev", immediate: true }));
app.use(express.static(path.join(__dirname, "public")));
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

mongoose.connect(`${url}/${db_name}`, {useMongoClient: true}).then( () => {

  const server = app.listen(port, () => {
    console.log(`start server port: ${port}`);
    logger.info(`start server port: ${port}`);
  });

  app.use("/", router);

}).catch(err => {

  logger.info(err);
  throw new Error(err);

});
