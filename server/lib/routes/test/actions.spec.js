import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import Router from "../";
import { intersection, uniq } from "lodash";
import { app, mongoUrl, initdbPromise, authData } from "./builder";

const base_url = "/api/v1/actions";
const login_url = "/api/login";
let auth;

describe(base_url, () => {
  app.use("/", Router);
  mongoose.connect(mongoUrl, { useMongoClient: true });

  before ( done => {
    initdbPromise.then( () => {
      request(app)
        .post(login_url)
        .send(authData)
        .end( (err, res) => {
          auth = res.body.body;
          done();
        });
    });
  });

  describe("get /", () => {
    const expected = {
      message: "アクションの取得に成功しました"
    };

    it("http(200)が返却される", done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .expect(200)
        .end( ( err, res ) => {
          done();
        });
    });

    it(`概要は「${expected.message}」`, done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .end( (err, res) => {
          expect(res.body.status.message).equal(expected.message);
          done();
        });
    });

    it("10件以上のオブジェクトが返却される", done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .end( (err, res) => {
          expect(res.body.body.length > 10).equal(true);
          done();
        });
    });

    it("返却されるオブジェクトは_id, name, labelカラムを含んでいる", done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .end( (err, res) => {
          const needle = ["_id", "name", "label"];

          const columns = res.body.body.map( o => (
            intersection(Object.keys(o), needle).length === 3
          ));

          expect(columns.every( col => col === true )).equal(true);
          done();
        });
    });

    it("返却されるオブジェクトの_id, name, labelカラムは0文字以上", done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .end( (err, res) => {
          const needle = ["_id", "name", "label"];

          const columns = res.body.body.map( obj => {
            return obj._id.length > 0 &&
              obj.name.length > 0 &&
              obj.label.length > 0;
          });

          expect(columns.every( col => col === true )).equal(true);
          done();
        });
    });

    it("nameカラムはuniqueなもの", done => {
      request(app)
        .get(base_url)
        .set("x-auth-cloud-storage", auth.token)
        .end( (err, res) => {
          const names = res.body.body.map( obj => obj.name );
          expect( uniq(names).length ).equal(names.length);
          done();
        });
    });
  });

});