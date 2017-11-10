import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import LoginRouter from "../login";

import { app, mongoUrl, initdbPromise } from "./builder";

const base_url = "/api/login";

describe(base_url, () => {
  app.use(base_url, LoginRouter);

  mongoose.connect(mongoUrl, { useMongoClient: true });

  // 前処理でdbを初期化しておく
  // shellがtimeoutになる場合、mochaの--timeoutオプションを変更する
  before( done => {
    initdbPromise.then( () => done() );
  });

  describe("post /", () => {
    describe("request bodyがundefineの場合", () => {
      it("http(400)が返却される", done => {
        request(app)
          .post(base_url)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("statusはfalse", done => {
        request(app)
          .post(base_url)
          .end( (err, res) => {
            expect(res.body.status.success).equal(false);
            done();
          });
      });

      it("エラーの概要(status.message)が0文字以上", done => {
        request(app)
          .post(base_url)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.account_nameが0文字以上", done => {
        request(app)
          .post(base_url)
          .end( (err, res) => {
            expect(res.body.status.errors.account_name.length > 0).equal(true);
            done();
          });
      });

    });

    describe("account_nameがnullの場合", () => {
      const requestBody = { account_name: null };

      it("http(400)が返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("statusはfalse", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.success).equal(false);
            done();
          });
      });

      it("エラーの概要(status.message)が0文字以上返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.account_nameが0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.errors.account_name.length > 0).equal(true);
            done();
          });
      });
    });

    describe("passwordがnullの場合", () => {
      const requestBody = { account_name: "hanako", password: null };

      it("http(400)が返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("statusはfalse", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.success).equal(false);
            done();
          });
      });

      it("エラー概要(status.message)が0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.passwordが0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.errors.password.length > 0).equal(true);
            done();
          });
      });

    });

    describe("指定されたaccount_nameがユーザマスタに存在しない場合", () => {
      const requestBody = { account_name: "nanashi", password: "nanashi" };

      it("http(400)が返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("statusはfalse", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.success).equal(false);
            done();
          });
      });

      it("エラー概要(status.message)が0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.account_nameが0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.errors.account_name.length > 0).equal(true);
            done();
          });
      });

    });


  });
});
