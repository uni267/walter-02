
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import kafka from "kafka-node"

//import kafkaClient from "./index";
const config = {
  kafka_topic: 'quztopic',
  kafka_server: '54.64.22.157:121851',
};

const enqueue = async (payloads) => {
  const client = new kafka.KafkaClient(config.kafka_server);
  const kafkaProducer = new kafka.Producer(client);
  try {
    kafkaProducer.on('ready', async function() {
      const push_status = await kafkaProducer.send(
        payloads, (err, data) => {
          if (err) {
            console.log(err)
            return err
          } else {
            console.log(data)
            return data
          }
      });
    });
    kafkaProducer.on('error', function(err) {
      console.log(err)
      throw err;
    });
  }
  catch(e) {
    console.log(e)
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
      const client = new kafka.KafkaClient(config.kafka_server);
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

    it(`producer 単独キュー送信`,async () => {
      const topic = 'partition2'
      const uuid = test_helper.getUUID()
      const payloads = [
        {
          topic: topic,
          partition: 0,
          messages: {uuid, data: 'hello!!'}
        },
      ];
      enqueue(payloads)
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
          console.log(message);
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