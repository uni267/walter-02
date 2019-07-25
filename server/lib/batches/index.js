import mongoose from "mongoose";
import co from "co";

import * as tasks from "./tasks/index";
import { SERVER_CONF } from "../configs/server";
import * as constants from "../configs/constants";
import logger from "../logger";

import addTenant from "./tasks/addTenant";
import initTenantW from "./tasks/initTenantW";
import { reCreateElasticCache } from "./tasks/initElasticsearch";
import initElasticsearch from "./tasks/initElasticsearch";
import addTimestampSetting from "./tasks/addTimestampSetting";
import initDb from "./tasks/initDatabase";

// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
const mode = process.env.NODE_ENV;

let url;
let db_name;

switch (mode) {

case "integration":
  url = SERVER_CONF.integration.url;
  db_name = SERVER_CONF.integration.db_name;
  break;

case "production":
  url = SERVER_CONF.production.url;
  db_name = SERVER_CONF.production.db_name;
  break;

default:
  url = SERVER_CONF.development.url;
  db_name = SERVER_CONF.development.db_name;
  break;
}

mongoose.connect(`${url}/${db_name}`, {useNewUrlParser: true}).then( async () => {
  const args = process.argv[2];
  switch (args) {
    case "analyze":
      await tasks.AnalyzeTask();
      break;
    case "perfTest":
      await tasks.PerfTest();
      break;
    case "addTenant":
      await addTenant(process.argv[3])
      //await tasks.addTenantTask(process.argv[3]);
      break;
    case "initTenantW":
      //await tasks.initTenantWTask();
        await initTenantW(process.argv[3])
      break;
    case "addTimestampSetting":
      //await tasks.addTimestampSettingTask();
      await addTimestampSetting(process.argv[3], process.argv[4], process.argv[5])
      break;
    case "reCreateElasticCache":
      //await tasks.reCreateElasticCacheTask();
      await reCreateElasticCache(process.argv[3])
      break;
    case "initElasticsearch":
      //await tasks.initElasticsearchTask();

      await initElasticsearch(process.argv[3])
      break;
    case "moveUnvisibleFiles":
      await tasks.moveInvisibleFilesTask();
      break;
    case "createAdmin":
      await tasks.createAdminTask();
      break;
    case "deleteAdmin":
      await tasks.deleteAdminTask();
      break;
    case "initDb":
      //await tasks.initDbTask();
      await initDb();
      break;
    default:
      throw new Error("引数が不正です。");
  }
  process.exit();
}).catch(e => {

  logger.error(e);
  process.exit();

});
