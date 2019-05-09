
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
//import defaults from "superagentdefaults";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import { Swift } from "../storages/Swift";


describe("controllers/filesのテスト", () => {
  const pdfFile = test_helper.loadResourceFile('sample.pdf')

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

  describe(`sendQueueToTika()`, () => {
    const tenant_id = '5cb02dd57faea500c6a0acb7'
    const file_id = '5cb03ac534679e36881995d4'
    beforeEach( () => {
    });

  })

});