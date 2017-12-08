import util from "util";
import co from "co";
import * as _ from "lodash";
import mongoose from "mongoose";
import Moment from "moment";
import { extendMoment } from "moment-range";

import supertest from "supertest";
import defaults from "superagent-defaults";

import Router from "../../lib/routes";
import { app, mongoUrl, initdbPromise, authData } from "../../lib/routes/test/builder";

// 日付のrangeを取得したいので
const moment = extendMoment(Moment);

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);
const request = defaults(supertest(app));

const dataLength = 10000;

const task = () => {
  co(function* () {
    try {
      yield initdbPromise;

      // token取得
      const login = yield (
        new Promise( (resolve, reject) => {
          request.post("/api/login")
            .send(authData)
            .end( (err, res) => {
              resolve(res);
            });
        })
      );

      const { user } = login.body.body;
      request.set("x-auth-cloud-storage", login.body.body.token);

      // metainfosマスタを取得 & 加工
      const _metainfos = yield (
        new Promise( (resolve, reject) => {
          request
            .get("/api/v1/meta_infos")
            .end( (err, res) => resolve(res.body.body) );
        })
      );

      const metainfos = [
        _.find(_metainfos, { name: "receive_date_time", value_type: "Date" }),
        _.find(_metainfos, { name: "send_company_name", value_type: "String" }),
        _.find(_metainfos, { name: "display_file_name", value_type: "String" })
      ];

      // tagマスタを取得し加工
      const _tags = yield (
        new Promise( (resolve, reject) => {
          request
            .get("/api/v1/tags")
            .end( (err, res) => resolve(res.body.body) );
        })
      );

      const tags = [
        false, _.get(_tags, ["0", "_id"])
      ];

      // received_dateの一覧テーブル
      const fromDate = moment("2017-01-01", "YYYY-MM-DD");
      const toDate = moment("2017-12-01",   "YYYY-MM-DD");
      const dateRange = moment.range(fromDate, toDate);

      let dateSeeds = [];

      for (let day of dateRange.by("day")) {
        dateSeeds = [ ...dateSeeds, day.format("YYYY-MM-DD hh:mm:ss")];
      }

      // アップロード処理
      const promises = _.range(dataLength).map( i => {

        // 基本情報
        let file = {
          name: `test_${i}.txt`,
          size: 4,
          mime_type: "text/plain",
          base64: "data:text/plain;base64,Zm9vCg==",
          checksum: "8f3bee6fbae63be812de5af39714824e"
        };

        // メタ情報
        const metainfo = metainfos.map( meta => {
          if (meta.value_type === "Date") {
            return {
              _id: meta._id,
              value: _.chain(dateSeeds).shuffle().head().value()
            };
          }
          else {
            return {
              _id: meta._id,
              value: Math.random().toString(36).slice(2)
            };
          }
        });
          
        console.log(util.inspect(metainfo, false, null));
        file.meta_infos = metainfo;

        // タグを付与するかどうか
        const fileTag = _.chain(tags).shuffle().head().value();

        if ( fileTag ) {
          file.tags = [ fileTag ];
        }

        const body = {
          files: [ file ]
        };

        return new Promise( (resolve, reject) => {
          request
            .post("/api/v1/files")
            .send(body)
            .end( (err, res) => resolve(res));
        });
      });

      const results = yield promises;
    }
    catch(e) {
      console.log(util.inspect(e, false, null));
    }
    finally {
      console.log(util.inspect("end", false, null));
      process.exit();
    }
  });
};

export default task;
