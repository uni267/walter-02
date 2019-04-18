import { KAFKA_CONF } from "../configs/server";
import request from "superagent";

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

export const enqueue = (payloads, kafka_server, request_timeout) => { // kafka_server以降は基本的には何も設定しない（テスト用）
  return new Promise( (resolve, reject) => {
    const server = kafka_server || config.kafka_server
    const timeout = request_timeout || 30000
    console.log('kafka_server:' + server)
    console.log('timeout:' + timeout)
    const client = new kafka.KafkaClient({
      kafkaHost: server, 
      requestTimeout: timeout,
    });
    const kafkaProducer = new kafka.Producer(client, {
      // Configuration for when to consider a message as acknowledged, default 1
      requireAcks: 1,
      // The amount of time in milliseconds to wait for all acks before considered, default 100ms
      ackTimeoutMs: 100,
      // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 2
    });
    kafkaProducer.on('ready', () => {
      kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            console.log('producer senderror:' + err)
            reject(err)
          } else {
            console.log('producer success:' + data)
            resolve(data)
          }
      });
    });
    kafkaProducer.on('error', err => {
      reject(err)
    });
  })
}

export const _enqueue = (payloads, kafka_server, request_timeout) => { // kafka_server以降は基本的には何も設定しない（テスト用）
  return new Promise( (resolve, reject) => {
    const server = kafka_server || config.kafka_server
    const timeout = request_timeout || 30000
    console.log('kafka_server:' + server)
    console.log('timeout:' + timeout)
    const client = new kafka.KafkaClient({
      kafkaHost: server, 
      requestTimeout: timeout,
    });
    const kafkaProducer = new kafka.Producer(client, {
      // Configuration for when to consider a message as acknowledged, default 1
      requireAcks: 1,
      // The amount of time in milliseconds to wait for all acks before considered, default 100ms
      ackTimeoutMs: 100,
      // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 2
    });
    kafkaProducer.on('ready', () => {
      kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            console.log('producer senderror:' + err)
            reject(err)
          } else {
            console.log('producer success:' + data)
            resolve(data)
          }
      });
    });
    kafkaProducer.on('error', err => {
      reject(err)
    });
  })
}
  // try {
  //   kafkaProducer.on('ready', async () => {
  //     const push_status = await kafkaProducer.send(
  //       payloads, async (err, data) => {
  //         if (err) {
  //           console.log('producer senderror:' + err)
  //           return new Promise((resolve, reject) => reject(err) )
  //         } else {
  //           console.log('producer success:' + data)
  //           return new Promise((resolve, reject) => resolve(data))
  //         }
  //     });
  //   });
  //   kafkaProducer.on('error', err => {
  //     return new Promise((resolve, reject) => reject(err) )
  //   });
  //   await sleep(60000)  //60秒待つ
  //   return new Promise((resolve, reject) => reject("enqueue() timeout") )
  // }
  // catch(e) {
  //   console.log('producer exception:' + e)
  //   throw e
  // }



export const dequeue = async (payloads) => {
}

// kafkaにメッセージを投げる
const _enqueue = async (payloads, kafka_server, request_timeout) => { // kafka_server以降は基本的には何も設定しない（テスト用）
  const server = kafka_server || config.kafka_server
  const timeout = request_timeout || 30000
  const client = new kafka.KafkaClient({
    kafkaHost: server, 
    requestTimeout: timeout,
  });
  const kafkaProducer = new kafka.Producer(client, {
    // Configuration for when to consider a message as acknowledged, default 1
    requireAcks: 1,
    // The amount of time in milliseconds to wait for all acks before considered, default 100ms
    ackTimeoutMs: 100,
    // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
    partitionerType: 2
  });

  try {
    kafkaProducer.on('ready', async () => {
      const push_status = await kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            console.log('producer senderror:' + err) //
            return err
          } else {
            console.log('producer success:' + data)
            return data
          }
      });
    });
    kafkaProducer.on('error', err => {
      console.log('producer onerror:' + err) //
      throw err;
    });
  }
  catch(e) {
    console.log('producer exception:' + e)
    throw e
  }

}

export default kafkaClient;