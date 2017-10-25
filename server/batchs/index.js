import mongoose from "mongoose";
import log4js from "log4js";
import co from "co";

import * as tasks from "./tasks/index";
import { SERVER_CONF } from "../configs/server";
import * as constants from "../configs/constants";

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

log4js.configure(constants.LOGGER_CONFIG);
export const logger = log4js.getLogger(mode);

mongoose.connect(`${url}/${db_name}`, {useMongoClient: true}).then( () => {
  const args = process.argv[2];
  switch (args) {
  case "analyze":
    tasks.AnalyzeTask();
    break;
  default:
    throw new Error("引数が不正です。");
  }
}).catch(err => {

  logger.info(err);
  throw new Error(err);

});
