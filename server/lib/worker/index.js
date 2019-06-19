import logger from "../logger/worker";

// worker process のダウン検知
process.on('uncaughtException', err => {
  console.log('uncaughtException => ' + err);
  logger.info("uncaughtException", JSON.stringify(err));
});

import { EventEmitter } from "events";
import { checkMongo, checkSwift, checkElastic, checkKafka, checkTika, getApiPort } from "../checkServices";
import { startTikaConsumer } from "./tikaConsumer";
import AppSetting from "../models/AppSetting";

console.log("checking conections ...");
logger.info("checking conections ...");

const event = new EventEmitter;
const status = {};
let fullTextSetting;

// mongo, swift, elasticsearch, kafka, tikaのヘルスチェックが完了通知を受け取ったらappを起動する
event.on("success", async middleware_name => {
  status[middleware_name] = true;

  if(middleware_name === 'mongo'){
    fullTextSetting = await AppSetting.findOne({
      //tenant_id: res.user.tenant_id,
      name: AppSetting.FULL_TEXT_SEARCH_ENABLED
    });
    if(fullTextSetting && fullTextSetting.enable ){ //全文検索オプションがONの時
      checkTika(process_checked('tika'));  
      checkKafka(process_checked('kafka'));
    }else{
      status.tika = true
      status.kafka = true
    }
  }
  
  if (status.mongo && status.swift && status.elastic &&  status.kafka &&  status.tika) {
    //ここがメイン処理

    if(fullTextSetting && fullTextSetting.enable){
      console.log("starting worker ...");
      logger.info("starting worker ...");
      startTikaConsumer() // tika用メッセージリスナーを開始
    }
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





