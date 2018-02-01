import express from "express";
import bodyParser from "body-parser";
import util from "util";
import co from "co";
import logger from "../../lib/logger";
import supertest from "supertest";
import defaults from "superagent-defaults";

// router
import Router from "../../lib/routes";

// models
import Tenant from "../../lib/models/Tenant";
import File from "../../lib/models/File";

import { FILE_LIMITS_PER_PAGE } from "../../lib/configs/constants";

const app = express();
app.use(bodyParser.json());
app.use("/", Router);

const request = defaults(supertest(app));

const task = () => {
  co(function* () {
    try {

      if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
      const tenant_name = process.argv[3];

      const tenant = yield Tenant.findOne({ name: tenant_name });
      if (tenant === null) throw new Error(`指定されたテナントは存在しません ${tenant_name}`);

      // 認証
      const authData = {
        account_name: "taro",
        password: "test",
        tenant_name: tenant_name
      };

      const authResponse = yield new Promise( (resolve, reject) => {
        request
          .post("/api/login")
          .send(authData)
          .end( (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
      });

      const { user, token } = authResponse.body.body;

      if (! user) throw new Error("ログイン時のユーザ情報取得に失敗");
      if (! token) throw new Error("ログイントークンの取得に失敗");
      request.set("x-auth-cloud-storage", token);

      // 非表示タグ自身を取得
      const tagsResponse = yield new Promise( (resolve, reject) => {
        request
          .get("/api/v1/tags")
          .end( (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
      });

      const tags = tagsResponse.body.body.filter( tag => {
        return tag.label === "非表示";
      });

      if (tags.length === 0) throw new Error("非表示タグの取得に失敗");

      const invisibleTagId = tags[0]._id;

      // 検索項目一覧を取得
      const searchItemsResponse = yield new Promise( (resolve, reject) => {
        request
          .get("/api/v1/files/search_items")
          .end( (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
      });

      const searchItems = searchItemsResponse.body.body.filter( item => {
        return item.label === "タグ";
      });

      if (searchItems.length === 0) throw new Error("displayItem名: 非表示の取得に失敗");

      const searchItemId = searchItems[0]._id;

      // 詳細検索にて非表示タグのついたファイルを検索する(page=0)
      const sendBody = { page: 0, sort: null };
      sendBody[searchItemId] = invisibleTagId;

      // 1回目を取得
      let visibleSearchResponse = yield visibleFileSearch(sendBody);

      // 対象ファイルが0件の場合は終了
      if (visibleSearchResponse.body.status.total === 0) process.exit();

      let targetFiles = visibleSearchResponse.body.body;

      // 非表示状態トグルのapiをコール
      yield targetFiles.map( file => {
        return new Promise( (resolve, reject) => {
          request
            .patch(`/api/v1/files/${file._id}/toggle_unvisible`)
            .end( (err, res) => {
              if (err) reject(err);
              resolve(res);
            });
        });
      });

      process.exit();
    }
    catch (e) {
      logger.error(e);
      console.log(e);
      process.exit();
    }
  });
};

const visibleFileSearch = (sendBody) => {
  return new Promise( (resolve, reject) => {
    request
      .post("/api/v1/files/search_detail")
      .send(sendBody)
      .end( (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
  });
};

export default task;
