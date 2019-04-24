
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import * as constants from "../configs/constants";
import { produce, getConsumer, closeConsumer, createTopics } from "../kafkaclient";
import { startTikaConsumer, getTikaResponse, getFileBuffer } from "./tikaConsumer";
import { checkMongo, checkSwift, checkElastic, checkKafka, checkTika, getApiPort } from "../checkServices";
import { Swift } from "../storages/Swift";

describe("tikaConsumerのテスト", () => {
  const topic_single_partition = 'topic_unit_test_single_partition'
  const topic_double_partition = 'topic_unit_test_double_partition'
  describe(`startTikaConsumer()`, () => {
    const createTikaMessage = async (tenant_id, tenant_name, file_id) => {
      const partition = 0
      const payloads = [
        {
          topic: 'tika',
          partition,
          messages: JSON.stringify({
            tenant_id, tenant_name, file_id
          })
        },
      ];
      const result = await produce(payloads)
    }
    before( () => {
    });
    after( () => {
    });
    it(`通常実行`,async () => {
      await createTikaMessage('5cbecc307bebf72fc44a8a1c', 'wakayama', '5cbecc307bebf72fc44a8a1c')
      //startTikaConsumer()
      //expect(response.full_text).match(/JICFS分類漢字分類名/)
    })
  })
  describe(`getTikaResponse()`, () => {
    before( () => {
    });
    after( () => {
    });
    it(`pdfを渡す`,async () => {
      const pdfFile = test_helper.loadResourceFile('jicfs.pdf')
      const response = await getTikaResponse(pdfFile)
      expect(response.full_text).match(/JICFS分類漢字分類名/)
    })
  })

  describe(`getFileBuffer()`, () => {
    const tenant_name = 'wakayama'
    
    const uuid = test_helper.getUUID()
    before( async () => {
      const swift = new Swift();
      const pdfFile = test_helper.loadResourceFile('jicfs.pdf')
      await swift.upload(tenant_name, pdfFile, uuid);
    });
    it(`正常取得`,async () => {
      const buffer = await getFileBuffer(tenant_name,{_id: uuid, is_crypted: false} )
      expect(buffer).to.not.be.null
      expect(buffer.length).equal(135414) //jicfs.pdfのサイズ
    })
  })

});