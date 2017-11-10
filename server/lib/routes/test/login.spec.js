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

    describe("パスワードが保存されたデータと一致しない場合", () => {
      const requestBody = { account_name: "hanako", password: "xxxx" };

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

      it("エラー概要が0文字以上", done => {
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

    describe("適切なaccount_name, passwordを渡した場合", () => {
      const requestBody = { account_name: "taro", password: "test" };

      it("http(200)が返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .expect(200)
          .end( (err, res) => {
            done();
          });
      });

      it("status.messageが0文字以上", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("body.tokenに100文字以上のtoken文字列が返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.body.token.length > 100).equal(true);
            done();
          });
      });

      it("ユーザの_id, tenant_idを含んだオブジェクトが返却される", done => {
        request(app)
          .post(base_url)
          .send(requestBody)
          .end( (err, res) => {
            expect(res.body.body.user._id.length > 0).equal(true);
            expect(res.body.body.user.tenant_id.length > 0).equal(true);
            done();
          });
      });

    });

  });

  describe("post /verify_token", () => {
    const verify_token_url = base_url + "/verify_token";

    describe("tokenが未定義の場合", () => {
      const body = {};

      it("http(400)が返却される", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("エラー概要が0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.tokenが0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.errors.token.length > 0).equal(true);
            done();
          });
      });
    });

    describe("tokenがnullの場合", () => {
      const body = {token: null};

      it("http(400)が返却される", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("エラー概要が0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.tokenが0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.errors.token.length > 0).equal(true);
            done();
          });
      });

    });

    describe("tokenの検証に失敗した場合", done => {
      const body = { token: "foobazbar" };

      it("http(400)が返却される", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .expect(400)
          .end( (err, res) => {
            done();
          });
      });

      it("エラー概要が0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.message.length > 0).equal(true);
            done();
          });
      });

      it("errors.tokenが0文字以上", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.status.errors.token.length > 0).equal(true);
            done();
          });
      });

    });

    describe("検証可能なトークンを渡した場合", done => {
      let body = {};

      before( done => {
        request(app)
          .post(base_url)
          .send({ account_name: "hanako", password: "test" })
          .end( (err, res) => {
            body.token = res.body.body.token;
            done();
          });
      });

      it("ユーザid, nameを含んだユーザオブジェクトが返却される", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.body.user._id.length > 0).equal(true);
            expect(res.body.body.user.name.length > 0).equal(true);
            done();
          });
      });

      it("token期限の開始、終了が返却される", done => {
        request(app)
          .post(verify_token_url)
          .send(body)
          .end( (err, res) => {
            expect(res.body.body.user.iat * 2 > 1).equal(true);
            expect(res.body.body.user.exp * 2 > 1).equal(true);
            done();
          });
      });

    });

  });

});
