
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import kafka from "kafka-node"

//import kafkaClient from "./index";


describe("kafkaclientのテスト", () => {

  describe(`kafkaClient()`, () => {
    const tenant_id = '5cb02dd57faea500c6a0acb7'
    const file_id = '5cb03ac534679e36881995d4'
    const config = {
      kafka_topic: 'quztopic',
      kafka_server: '54.64.22.157:12181',
    };    
    beforeEach( () => {
    });

    it(`send`,async () => {
      let finished = false
      try {
        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient(config.kafka_server);
        const producer = new Producer(client);

        const payloads = [
          {
            topic: config.kafka_topic,
            messages: "hello! kafka"
          }
        ];

        producer.on('ready', async function() {
          const push_status = await producer.send(payloads, (err, data) => {
            finished = true;
            if (err) {
              return err
            } else {
              return data
            }
          });
        });
      
        producer.on('error', function(err) {
          throw err;
        });
      }
      catch(e) {
        finished = true
      }
      await test_helper.sleep(5000)             
      console.log('finish');
    })
  // it(`send2`,t => {
  //   const Producer = kafka.Producer;
  //   const client = new kafka.KafkaClient({
  //       kafkaHost: "localhost:12181"
  //   });
  //   const producer = new Producer(client, {
  //       partitionerType: 0
  //   });

  //   producer.on("ready", () => {
  //       const payloads = [
  //           {
  //               topic: "quztopic",
  //               messages: JSON.stringify({name: "あああああ", age: 24})
  //           },
  //           {
  //               topic: "quztopic",
  //               messages: [
  //                   JSON.stringify({name: "いいいいい", age: 11}),
  //                   JSON.stringify({name: "うううううう", age: 9})
  //               ]
  //           }
  //       ];

  //       producer.send(payloads, (err, data) => {
  //           t.end();
  //       });
  //   });
  //   //expect(1).equal(1);
  // });

  })

});