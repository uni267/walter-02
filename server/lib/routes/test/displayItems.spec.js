import supertest from "supertest";
import defaults from "superagent-defaults";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import * as _ from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

mongoose.connect(mongoUrl, { useMongoClient: true });
app.use("/", Router);

const { ObjectId } = mongoose.Types;

const items_url = "/api/v1/display_items";
const login_url = "/api/login";

const request = defaults(supertest(app));
let user;

describe(items_url, () => {

  before( done => {
    initdbPromise.then( () => {
      new Promise( (resolve, reject) => {
        request.post(login_url)
          .send(authData)
          .end( (err, res) => {
            request.set("x-auth-cloud-storage", res.body.body.token);
            resolve(res);
          });
      }).then( res => {
        const user_id = res.body.body._id;

        return new Promise( (resolve, reject) => {
          request
            .get(`/api/v1/users/${user_id}`)
            .end( (err, res) => resolve(res));
        });
      }).then( res => {
        user = res.body.body;
        done();
      });
    });
  });

  describe("get /", () => {
    let payload;

    before( done => {
      request
        .get(items_url)
        .end( (err, res) => {
          payload = res;
          done();
        });
    });

    it("http(200)が返却される", done => {
      expect(payload.status).equal(200);
      done();
    });

    it("successはtrue", done => {
      expect(payload.body.status.success).equal(true);
      done();
    });

    it("必要なカラムを含んでいる", done => {
      const needle = [
        "_id", "tenant_id", "meta_info_id", "label",
        "name", "search_value_type", "is_display", "order", "width"
      ];

      const columns = payload.body.body
            .map( item => _.keys(item) )
            .map( keys => _.intersection(keys, needle) )
            .map( keys => keys.length === needle.length );

      expect(columns.every( b => b === true )).equal(true);
      done();
    });

  });

});
