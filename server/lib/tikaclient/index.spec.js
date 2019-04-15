
import moment from "moment";
import * as _ from "lodash";
import supertest from "supertest";
//import defaults from "superagentdefaults";
import { expect } from "chai";
import * as test_helper from "../test/helper";
import tikaClient from "./index";


describe("tikaclientのテスト", () => {
  const pdfFile = test_helper.loadResourceFile('sample.pdf')

  describe(`tikaClient()`, () => {
    const tenant_id = '5cb02dd57faea500c6a0acb7'
    const file_id = '5cb03ac534679e36881995d4'
    beforeEach( () => {
    });

    it(`getTextInfo`,async () => {
      const result = await tikaClient.getTextInfo(pdfFile)
      const matched = result.text.match(/メーカープライベートコード/)
      expect(matched).to.not.be.null;
    })
    it(`getMetaInfo`,async () => {
      const result = await tikaClient.getMetaInfo(pdfFile)
      expect(JSON.parse(result.text).producer).equal("LibreOffice 6.2");
    })
  })

});