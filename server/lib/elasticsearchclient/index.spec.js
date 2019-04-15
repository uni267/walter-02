import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
//import defaults from "superagentdefaults";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import { Swift } from "../storages/Swift";
import esClient from "./index";


describe("elasticsearchclientのテスト", () => {
  const __searchTextContents = async (tenant_id, file_id) => {
    const result = await esClient.search({
      index: tenant_id,
      type: "files",
      body:
      {
        "query": {
          "term": {
              "_id": file_id
          }
        }
      }
    })
    return { result_full_text: result.hits.hits[0]._source.file.full_text, result_meta_text: result.hits.hits[0]._source.file.meta_text}
  }

  describe(`updateTextContents()`, async () => {
    const tenant_id = '5cb02dd57faea500c6a0acb7'
    const file_id = '5cb03ac534679e36881995d4'
    let full_text = 'happy?'
    let meta_text = 'yes!'
    before( async () => {
      //const indices = await esClient.cat.indices({v: true}) //index一覧の取得
    });
    after( async () => {
    });

    it(`ascii値で更新`,async () => {
      full_text = 'happy?'
      meta_text = 'yes!'
      await esClient.updateTextContents(tenant_id, file_id, meta_text, full_text)
      await test_helper.sleep(3000) //elasticsearchの更新間隔を待つ
      const {result_full_text, result_meta_text} = await __searchTextContents(tenant_id, file_id)
      expect(full_text).equal(result_full_text);
      expect(meta_text).equal(result_meta_text);
    })
    it(`null値で更新`,async () => {
      full_text = null
      meta_text = null
      await esClient.updateTextContents(tenant_id, file_id, meta_text, full_text)
      await test_helper.sleep(3000) //elasticsearchの更新間隔を待つ
      const {result_full_text, result_meta_text} = await __searchTextContents(tenant_id, file_id)
      expect(full_text).equal(result_full_text);
      expect(meta_text).equal(result_meta_text);
    })
    it(`日本語値で更新`,async () => {
      full_text = "日本語も"
      meta_text = "大丈夫！"
      await esClient.updateTextContents(tenant_id, file_id, meta_text, full_text)
      await test_helper.sleep(3000) //elasticsearchの更新間隔を待つ
      const {result_full_text, result_meta_text} = await __searchTextContents(tenant_id, file_id)
      expect(full_text).equal(result_full_text);
      expect(meta_text).equal(result_meta_text);
    })
  })

});