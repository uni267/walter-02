
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import kafka from "kafka-node"
import { produce, getConsumer, closeConsumer, createTopics } from "./index";




describe("kafkaclientのテスト", () => {
  const topic_single_partition = 'topic_unit_test_single_partition'
  const topic_double_partition = 'topic_unit_test_double_partition'
  describe(`kafkaClient()`, () => {
    before( () => {
    });
    after( () => {
    });
    it(`producer topics作成`,async () => {
      await createTopics([
        {
          topic: topic_single_partition,
          partitions: 1,
          replicationFactor: 1
        },
        {
          topic: topic_double_partition,
          partitions: 2,
          replicationFactor: 1
        }
      ])
    })

    it(`producer 単独キュー送信`,async () => {
      const partition = 0
      const uuid = test_helper.getUUID()
      const payloads = [
        {
          key: 'theKey',
          topic: topic_double_partition,
          partition,
          messages: JSON.stringify({file_id: uuid})
        },
      ];
      const result = await produce(payloads)
      expect(result[topic_double_partition][partition]).to.not.be.undefined
    })

    it(`producer 不明なtopicへ送信`,async () => {
      const uuid = test_helper.getUUID()
      const payloads = [{
          topic: '????????',
          messages: JSON.stringify({file_id: uuid})
      },];
      try{
        const result = await produce(payloads)
        expect("ここが評価されるのはNG").to.be.null
      }catch(e){
        expect(e.message).equal('InvalidTopic')
      }
    })

    it.skip(`producer 存在しないホストに送信`,async () => {
      const partition = 0
      const uuid = test_helper.getUUID()
      const payloads = [{
        topic_double_partition,
        messages: JSON.stringify({file_id: uuid})
      },];
      const config = {kafkaHost:'unknown_host:11111', connectTimeout: 1000}
      try{
        const result = await produce(payloads,config)
        expect("ここが評価されるのはNG").to.be.null
      }catch(e){
        expect(e.message).equal('InvalidTopic')
      }
    })
    it(`producer 複数キュー送信`,async () => {
      const uuids = [test_helper.getUUID(), test_helper.getUUID(), test_helper.getUUID()]
      const payloads = uuids.map( uuid => ({
          topic: topic_double_partition,
          partition: 1,
          messages: `message ${uuid}`
      }))
      const result = await produce([
        ...payloads,
        {
          topic: topic_single_partition,
          partition: 0,
          messages: [`message test1!!!`, `message test2!!!`]
        }
      ])
      expect(result).to.have.property(topic_double_partition);
      expect(result).to.have.property(topic_single_partition);
    })

    it(`consumer 単一受信`,async () => {
      const payloads = [
        { topic: topic_single_partition, partition: 0},
        //{ topic: 'quztopic', partition: 0 }, { topic: 'partition2', partition: 1 }
      ];
      const consumer = getConsumer(payloads)
      consumer.on('message', async message => {
        console.log(message)
        if(message.offset == (message.highWaterOffset -1)){
          await closeConsumer(consumer)
        }
      });
      consumer.on('error', err => {
        expect("errorが発生").to.be.null
      })
    })
  })
});