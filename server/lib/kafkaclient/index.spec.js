
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import kafka from "kafka-node"

//import kafkaClient from "./index";
const config = {
  kafka_server: '54.64.22.157:12181',
};

const enqueue = async (payloads, kafka_server, request_timeout) => { // kafka_server以降は基本的には何も設定しない（テスト用）
  const server = kafka_server === undefined || kafka_server === null ? config.kafka_server : kafka_server
  const timeout = request_timeout === undefined || request_timeout === null ? 30000 : request_timeout
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
  try {
    kafkaProducer.on('ready', async function() {
      const push_status = await kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            console.log('producer senderror:' + err) //ok
            return err
          } else {
            console.log('producer success:' + data)
            return data
          }
      });
    });
    kafkaProducer.on('error', function(err) {
      console.log('producer onerror:' + err) //
      throw err;
    });
  }
  catch(e) {
    console.log('producer exception:' + e)
    throw e
  }

}

const dequeue = async (payloads) => {
}



describe("kafkaclientのテスト", () => {

  describe(`kafkaClient()`, () => {
    before( () => {
    });
    after( () => {
    });

    it(`createTopics `,async () => {
      //const client = new kafka.KafkaClient(config.kafka_server);
      // client.createTopics([{
      //   topic: 'topic1',
      //   partitions: 1,
      //   replicationFactor: 2
      // },], (error, result) => {
      //   console.log(result)
      //   console.log(error)
      //   // result is an array of any errors if a given topic could not be created
      // });
    })
    it(`producer`,async () => {
      const topic = 'partition2'
      const payloads = [
        {
          topic: '?????',
          partition: 0,
          messages: 'hello!'
        },
      ];
      await enqueue(payloads, 'unknownhost', 1000)
      await test_helper.sleep(8000)             

    })

    it(`producer 単独キュー送信`,async () => {
      const topic = 'partition2'
      const uuid = test_helper.getUUID()
      const payloads = [
        {
          topic: topic,
          partition: 0,
          messages: JSON.stringify({file_id: uuid})
        },
      ];
      enqueue(payloads)
      let finished = false
      await test_helper.sleep(5000)             
      console.log('finish');
    })
    it(`producer 不明なtopicへ送信`,async () => {
      const topic = '????????'
      const uuid = test_helper.getUUID()
      const payloads = [
        {
          topic: topic,
          partition: 0,
          messages: JSON.stringify({file_id: uuid})
        },
      ];
      enqueue(payloads)

      // senderror:Error: InvalidTopic
      let finished = false
      await test_helper.sleep(5000)             
      console.log('finish');
    })
    it(`producer 複数キュー送信`,async () => {
      const topic = 'partition2'
      const uuids = [test_helper.getUUID(), test_helper.getUUID(), test_helper.getUUID()]
      const payloads = uuids.map( uuid => ({
          topic: topic,
          partition: 1,
          messages: `message ${uuid}`
      }))
      enqueue([
        ...payloads,
        {
          topic: 'quztopic',
          partition: 0,
          messages: [`message test1!!!`, `message test2!!!`]
        }
      ])
      let finished = false
      await test_helper.sleep(5000)             
      console.log('finish');
    })
    it(`consumer メッセージ受信`,async () => {
      const client = new kafka.KafkaClient(config.kafka_server);
      const consumer = new kafka.Consumer(
          client,
          [
              { topic: 'quztopic', partition: 0 }, { topic: 'partition2', partition: 1 }
          ],
          {
              autoCommit: true,
              autoCommitIntervalMs: 5000,
          }
      );
        consumer.on('message', function (message) {
          //console.log(message);
          if(message.offset == (message.highWaterOffset -1)){
            consumer.close(true, (err, message) => {
              console.log("consumer has been closed..");
            });
          }
        });
        await test_helper.sleep(8000)             
    })
  })
});