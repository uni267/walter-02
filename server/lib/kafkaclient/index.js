import { KAFKA_CONF } from "../configs/server";
import { KAFKA_CONNECTION_TIMEOUT } from "../configs/constants";
import request from "superagent";
import kafka from "kafka-node"

const mode = process.env.NODE_ENV;

let kafkaUrl;

switch (mode) {
  case "integration":
    kafkaUrl = `${KAFKA_CONF.integration.host}:${KAFKA_CONF.integration.port}`;
    break;

  case "production":
    if (! process.env.KAFKA_HOST_NAME) throw new Error("env.KAFKA_HOST_NAME is not set");

    kafkaUrl = `${KAFKA_CONF.production.host}:${KAFKA_CONF.production.port}`;
    break;

  default:
    kafkaUrl = `${KAFKA_CONF.development.host}:${KAFKA_CONF.development.port}`;
    break;
}

export const getKafkaClient = config => {
  return new kafka.KafkaClient({
    kafkaHost: config ? config.kafkaHost : kafkaUrl,
    sessionTimeout: KAFKA_CONNECTION_TIMEOUT,
    //connectTimeout: config ? config.connectTimeout : KAFKA_CONNECTION_TIMEOUT,  //←なぜか動かない
    //requestTimeout: config ? config.connectTimeout : KAFKA_CONNECTION_TIMEOUT,
  })  
}

export const createTopics = topicsToCreate => {
  const client = getKafkaClient()
  const admin = new kafka.Admin(client); 
  return new Promise( (resolve, reject) => {
    admin.createTopics(topicsToCreate, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    });
  })
}


// kafkaホストにキュー送信
export const produce = (payloads, config) => { // configには設定しない（テスト用）
  return new Promise( (resolve, reject) => {
    const client = getKafkaClient(config)
    const kafkaProducer = new kafka.Producer(client, {
      // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 2
    });

    kafkaProducer.on('ready', () => {
      //console.log('producer is ready')
      kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            //console.log('producer senderror:' + err)
            reject(err)
          } else {
            //console.log('producer success:' + data)
            resolve(data)
          }
      });
    });
    kafkaProducer.on('error', err => {
      console.log('producer error:' + err)
      reject(err)
    });
    // kafkaProducer.on('uncaughtException', err => {
    //   console.log('producer uncaughtException:' + err)
    //   reject(err)
    // });
  })
}

export const getConsumer = (payloads, config) => { // configには設定しない（テスト用）
  const client = getKafkaClient(config);
  const consumer = new kafka.Consumer(
      client,
      payloads,
      {
          autoCommit: false,
      }
  );
  return consumer
}
export const  closeConsumer = consumer =>{
  return new Promise((resolve, reject) => {
    consumer.close(true, () => resolve())
  })
} 

