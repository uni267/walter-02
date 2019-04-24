import logger from "../logger/worker";
import esClient from "../elasticsearchclient";
import tikaClient from "../tikaclient";
import { Swift } from "../storages/Swift";
import File from "../models/File";
import * as constants from "../configs/constants";
import { produce, getConsumer, closeConsumer, createTopics } from "../kafkaclient";
import { ValidationError } from "../errors/AppError";

// debug用
import pkgcloud from "pkgcloud";
import { STORAGE_CONF } from "../configs/server";
import stream from "stream";
import fs from "fs";

export const startTikaConsumer = () => {
  const tika_consumer_payloads = [{
    topic: constants.KAFKA_TOPIC_TIKA, //partition: 0, 
  }]
  const tika_consumer = getConsumer(tika_consumer_payloads)
  // logger.info("tika consumer created", JSON.stringify(tika_consumer_payloads));
  
  
  tika_consumer.on('message', async message => {
    try{
        //if(message.offset == (message.highWaterOffset -1)){
          console.log('mesage.value: ' + message.value)
          const json_message = JSON.parse(message.value)

          const fileRecord = await File.findById(json_message.file_id);
          if (fileRecord === null) throw new ValidationError( "file is empty" );
          if (fileRecord.is_deleted) throw new ValidationError( "file is deleted" );

          // OpenStack Swiftより、ファイルを読み込む
          const buffer = await getFileBuffer(json_message.tenant_name, fileRecord)
          if(!buffer)  throw new ValidationError( "buffer is empty" )

          const tikaResponse = await getTikaResponse(buffer)
          if(!tikaResponse)  throw new ValidationError( "tika response is empty" )
          
          await esClient.updateTextContents(json_message.tenant_id, json_message.file_id, tikaResponse.meta_text, tikaResponse.full_text)

          // メッセージのコミット
          await new Promise((resolve,reject)=>{
            tika_consumer.commit((error, data)=>{
              if(error) reject(error)
              resolve(data)
            })
          })
        //}
      }catch(e){
        console.log(e)
        logger.info("tika consumer error: ", JSON.stringify(e));
      }
  });
  tika_consumer.on('error', error => {
    console.log('tika consumer error: ' + error)
    logger.info("tika consumer error: ", JSON.stringify(error));
  })
}
export const getTikaResponse = async buffer => {
  const response_meta_text = await tikaClient.getMetaInfo(buffer)
  const response_full_text = await tikaClient.getTextInfo(buffer)
  //console.log(response_full_text.text)
  const meta_info = JSON.parse(response_meta_text.text)
  const meta_text = ''  //meta_info.Content-Type || ''
  return {full_text: response_full_text.text, meta_text}
}

export const getFileBuffer = async (tenant_name, fileRecord) => {
  return await new Promise(async (resolve, reject) => {
    const swift = new Swift();
    const bufs = []
    const readStream = await swift.downloadFile(tenant_name, fileRecord);
    readStream.on("data", data => bufs.push( data ) );
    readStream.on("end", () => resolve(Buffer.concat( bufs )) );
    readStream.on("error", err => reject(err) );
  })
}

