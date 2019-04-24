import logger from "../logger/worker";

// worker process のダウン検知
process.on('uncaughtException', err => {
  console.log('uncaughtException => ' + err);
  logger.info("uncaughtException", JSON.stringify(err));
});

import { EventEmitter } from "events";
import * as constants from "../configs/constants";
import { checkMongo, checkSwift, checkElastic, checkKafka, checkTika, getApiPort } from "../checkServices";
import { produce, getConsumer, closeConsumer, createTopics } from "../kafkaclient";
import { tika } from "./tika";

console.log("checking conections ...");
logger.info("checking conections ...");

const event = new EventEmitter;
const status = {};

// mongo, swift, elasticsearch, kafka, tikaのヘルスチェックが完了通知を受け取ったらappを起動する
event.on("success", middleware_name => {
  status[middleware_name] = true;
  
  if (status.mongo && status.swift && status.elastic &&  status.kafka &&  status.tika) {
    //ここがメイン処理
    console.log("starting worker ...");
    logger.info("starting worker ...");
    
    const tika_consumer_payloads = [{
      topic: constants.KAFKA_TOPIC_TIKA, //partition: 0, 
    }]
    const tika_consumer = getConsumer(tika_consumer_payloads)
    // logger.info("tika consumer created", JSON.stringify(tika_consumer_payloads));
    
    
    tika_consumer.on('message', async message => {
      console.log(message)
      if(message.offset == (message.highWaterOffset -1)){
        //console.log(message)
        const json_message = JSON.parse(message.value)
        await tika(json_message.tenant_name, json_message.file_id)
        //ここでコミット
        try{
          // const result = await new Promise((resolve,reject)=>{
          //   tika_consumer.commit((error, data)=>{
          //     if(error) reject(error)
          //     resolve(data)
          //   })
          // })
          //console.log(result)
        }catch(e){
          console.log(e)
          logger.info("tika consumer error: ", JSON.stringify(e));
        }
      }
    });
    tika_consumer.on('error', error => {
      console.log('tika consumer error: ' + error)
      logger.info("tika consumer error: ", JSON.stringify(error));
    })
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





