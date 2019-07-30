"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _util = _interopRequireDefault(require("util"));

var _supertest = _interopRequireDefault(require("supertest"));

var _superagentDefaults = _interopRequireDefault(require("superagent-defaults"));

var _chai = require("chai");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _2 = _interopRequireDefault(require("../"));

var _ = _interopRequireWildcard(require("lodash"));

var _builder = require("./builder");

_mongoose["default"].connect(_builder.mongoUrl, {
  useMongoClient: true
});

_builder.app.use("/", _2["default"]);

var user_url = "/api/v1/users";
var login_url = "/api/login";
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
var user;
describe(user_url + "/:user_id", function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      request.post(login_url).send(_builder.authData).end(function (err, res) {
        request.set("x-auth-cloud-storage", res.body.body.token);
        user = res.body.body.user;
        done();
      });
    });
  }); // ユーザ有効/無効のトグル

  describe("patch /:user_id/enabled", function () {
    var toggleUser; // ログインユーザ以外をピックアップ

    before(function (done) {
      request.get(user_url).end(function (err, res) {
        var __user = res.body.body.filter(function (_user) {
          return _user.enabled === true && _user._id !== user._id;
        });

        toggleUser = _.head(__user);
        done();
      });
    }); // 対象のユーザが無効だった場合、有効に戻す後処理

    afterEach(function (done) {
      new Promise(function (resolve, reject) {
        request.get(user_url + "/".concat(toggleUser._id)).end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        if (res.body.body.enabled === false) {
          return new Promise(function (resolve, reject) {
            request.patch(user_url + "/".concat(toggleUser._id, "/enabled")).end(function (err, res) {
              return resolve(res);
            });
          });
        } else {
          return new Promise(function (resolve, reject) {
            return resolve();
          });
        }
      }).then(function (res) {
        done();
      });
    });
    describe("有効な状態である他ユーザのuser_idを指定した場合", function () {
      var payload;
      var nextPayload;
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(toggleUser._id, "/enabled")).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(toggleUser._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("ユーザ詳細を取得した結果、enabled = falseとなる", function (done) {
        (0, _chai.expect)(nextPayload.body.body.enabled).equal(false);
        done();
      });
    });
    describe("変更されたユーザがログインした場合", function () {
      var payload;
      var expected = {
        message: "ユーザ認証に失敗しました",
        detail: "指定されたユーザは現在無効状態のためユーザ認証に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(toggleUser._id, "/enabled")).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(toggleUser._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          return new Promise(function (resolve, reject) {
            request.post(login_url).send({
              account_name: toggleUser.account_name,
              password: "test"
            }).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          payload = res;
          done();
        });
      });
      it("http(400)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(400);
        done();
      });
      it("statusはfalse", function (done) {
        (0, _chai.expect)(payload.body.status.success).equal(false);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
        done();
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var expected = {
          message: "ユーザの有効化/無効化に失敗しました",
          detail: "ユーザIDが不正のためユーザの有効化/無効化に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/invalid_oid/enabled").end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
  }); // アカウント名変更

  describe("patch /:user_id/account_name", function () {
    var changeUser;
    before(function (done) {
      request.get(user_url).end(function (err, res) {
        var __user = res.body.body.filter(function (_user) {
          return _user.enabled === true && _user._id !== user._id;
        });

        changeUser = _.head(__user);
        done();
      });
    });
    describe("他ユーザのuser_id, 正しいaccount_nameを指定した場合", function () {
      var payload;
      var nextPayload;
      var body = {
        account_name: "foobar"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(changeUser._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      }); // 変更したaccount_nameを元に戻しておく

      after(function (done) {
        request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send({
          account_name: changeUser.account_name
        }).end(function (err, res) {
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("ユーザ詳細を取得した結果、account_nameが変更された値として返却される", function (done) {
        (0, _chai.expect)(nextPayload.body.body.account_name).equal(body.account_name);
        done();
      });
      describe("変更したユーザにて変更後のaccount_nameでログインした場合", function () {
        var payload;
        before(function (done) {
          request.post(login_url).send({
            account_name: body.account_name,
            password: "test"
          }).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(200)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(200);
          done();
        });
        it("トークンが返却される", function (done) {
          (0, _chai.expect)(payload.body.body.token.length > 0).equal(true);
          done();
        });
        it("ユーザオブジェクトが返却される", function (done) {
          (0, _chai.expect)(payload.body.body.user._id.length > 0).equal(true);
          done();
        });
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "ユーザIDが不正のためログイン名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/invalid_oid/account_name").send({
            account_name: "foobar"
          }).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
    describe("指定されたaccount_nameが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body = {};
        var expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "アカウント名が空のためログイン名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body = {
          account_name: null
        };
        var expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "アカウント名が空のためログイン名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body = {
          account_name: ""
        };
        var expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "アカウント名が空のためログイン名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      });
      describe("255文字以上の場合", function () {
        var payload;
        var body = {
          account_name: _.range(257).map(function (i) {
            return "1";
          }).join("")
        };
        var expected = {
          message: "ログイン名の変更に失敗しました",
          detail: "アカウント名が規定文字数(255)を超過したためログイン名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
          done();
        });
      }); // account_nameは禁止文字の対象外

      describe.skip("禁止文字(\\, / , :, *, ?, <, >, |)が含まれている場合", function () {
        describe("バックスラッシュ", function () {
          var payload;
          var body = {
            account_name: "\\foo\\bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("スラッシュ", function () {
          var payload;
          var body = {
            account_name: "/foo/bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("コロン", function () {
          var payload;
          var body = {
            account_name: ":foo:bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("アスタリスク", function () {
          var payload;
          var body = {
            account_name: "*foo*bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("クエスチョン", function () {
          var payload;
          var body = {
            account_name: "?foo?bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("山括弧開く", function () {
          var payload;
          var body = {
            account_name: "<foo<bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("山括弧閉じる", function () {
          var payload;
          var body = {
            account_name: ">foo>bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
        describe("パイプ", function () {
          var payload;
          var body = {
            account_name: "|foo|bar"
          };
          var expected = {
            message: "ログイン名の変更に失敗しました",
            detail: "ログイン名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.post(user_url + "/".concat(changeUser._id, "/account_name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.account_name).equal(expected.detail);
            done();
          });
        });
      });
    });
  }); // ユーザの表示名変更

  describe("patch /:user_id/name", function () {
    var changeUser;
    before(function (done) {
      request.get(user_url).end(function (err, res) {
        var __user = res.body.body.filter(function (_user) {
          return _user.enabled === true && _user._id !== user._id;
        });

        changeUser = _.head(__user);
        done();
      });
    });
    describe("他ユーザのuser_id, 正しいnameを指定した場合", function () {
      var payload;
      var nextPayload;
      var body = {
        name: "foobar"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(changeUser._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("ユーザ詳細を取得した結果、nameが変更された値として返却される", function (done) {
        (0, _chai.expect)(nextPayload.body.body.name).equal(body.name);
        done();
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var body = {
          name: "foobar"
        };
        var expected = {
          message: "ユーザの表示名の変更に失敗しました",
          detail: "ユーザIDが不正のため表示名の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/invalid_oid/name").send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
    describe("指定されたnameが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body = {};
        var expected = {
          message: "ユーザの表示名の変更に失敗しました",
          detail: "表示名が空のため変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body = {
          name: null
        };
        var expected = {
          message: "ユーザの表示名の変更に失敗しました",
          detail: "表示名が空のため変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body = {
          name: ""
        };
        var expected = {
          message: "ユーザの表示名の変更に失敗しました",
          detail: "表示名が空のため変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("255文字以上の場合", function () {
        var payload;
        var body = {
          name: _.range(257).map(function (i) {
            return "1";
          }).join("")
        };
        var expected = {
          message: "ユーザの表示名の変更に失敗しました",
          detail: "表示名が規定文字数(255)を超過したため変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe.skip("禁止文字(\\, / , :, *, ?, <, >, |)が含まれている場合", function () {
        describe("バックスラッシュ", function () {
          var payload;
          var body = {
            name: "\\foo\\bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("スラッシュ", function () {
          var payload;
          var body = {
            name: "/foo/bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("コロン", function () {
          var payload;
          var body = {
            name: ":foo:bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("アスタリスク", function () {
          var payload;
          var body = {
            name: "*foo*bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("クエスチョン", function () {
          var payload;
          var body = {
            name: "?foo?bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧開く", function () {
          var payload;
          var body = {
            name: "<foo<bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧閉じる", function () {
          var payload;
          var body = {
            name: ">foo>bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
        describe("パイプ", function () {
          var payload;
          var body = {
            name: "|foo|bar"
          };
          var expected = {
            message: "ユーザの表示名の変更に失敗しました",
            detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
          };
          before(function (done) {
            request.patch(user_url + "/".concat(changeUser._id, "/name")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status.success).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
            done();
          });
        });
      });
    });
  }); // メールアドレス変更

  describe("patch /:user_id/email", function () {
    describe("他ユーザのuser_id, 正しいemailを指定した場合", function () {
      var payload;
      var nextPayload;
      var body = {
        email: "foobar@example.com"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(user._id, "/email")).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(user._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("ユーザ詳細を取得した結果、emailが変更された値として返却される", function (done) {
        (0, _chai.expect)(nextPayload.body.body.email).equal(body.email);
        done();
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var body = {
          email: "foobar@example.com"
        };
        var expected = {
          message: "メールアドレスの変更に失敗しました",
          detail: "ユーザIDが不正のためメールアドレスの変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/invalid_oid/email").send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
    describe("指定されたemailが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body = {};
        var expected = {
          message: "メールアドレスの変更に失敗しました",
          detail: "指定されたメールアドレスが空のためメールアドレスの変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/email")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.email).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body = {
          email: null
        };
        var expected = {
          message: "メールアドレスの変更に失敗しました",
          detail: "指定されたメールアドレスが空のためメールアドレスの変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/email")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.email).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var nextPayload;
        var body = {
          email: ""
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.patch(user_url + "/".concat(user._id, "/email")).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
      });
      describe("64文字以上の場合", function () {
        var payload;
        var body = {
          email: "jugemjugemjugemjugemjugemjugemjugemjugemjugemjugemjugem@jugem.com"
        };
        var expected = {
          message: "メールアドレスの変更に失敗しました",
          detail: "メールアドレスが規定文字数(64)を超過したためメールアドレスの変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/email")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.email).equal(expected.detail);
          done();
        });
      });
      describe("禁止文字(RFC5322における)が含まれている場合", function () {
        it.skip("ライブラリを使用するので本テストではスコープ外");
      });
    });
  }); // 所属グループの削除

  describe("delete /:user_id/groups/:group_id", function () {
    describe("user_id, group_idを正しく指定した場合", function () {
      var payload;
      var nextPayload;
      var group_id;
      before(function (done) {
        group_id = _.head(user.groups);
        new Promise(function (resolve, reject) {
          request["delete"](user_url + "/".concat(user._id, "/groups/").concat(group_id)).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(user._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("変更したユーザを取得した場合、削除したグループが含まれていない", function (done) {
        var exists = nextPayload.body.body.groups.every(function (group) {
          return group !== group_id;
        });
        (0, _chai.expect)(exists).equal(true);
        done();
      });
      it("ユーザの所属するグループ数が1つのみ減少している", function (done) {
        (0, _chai.expect)(user.groups.length - 1).equal(nextPayload.body.body.groups.length);
        done();
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var group_id;
        var expected = {
          message: "グループのメンバ削除に失敗しました",
          detail: "ユーザIDが不正のためグループのメンバ削除に失敗しました"
        };
        before(function (done) {
          group_id = _.head(user.groups);
          request["delete"](user_url + "/invalid_oid/groups/".concat(group_id)).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
    describe("指定されたgroup_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var expected = {
          message: "グループのメンバ削除に失敗しました",
          detail: "グループIDが不正のためグループのメンバ削除に失敗しました"
        };
        before(function (done) {
          request["delete"](user_url + "/".concat(user._id, "/groups/invalid_oid")).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });
      describe("userが所属していないgroup_idの場合", function () {
        var payload;
        var group_id;
        var expected = {
          message: "グループのメンバ削除に失敗しました",
          detail: "指定されたグループにユーザが所属していないためグループのメンバ削除に失敗しました"
        };
        before(function (done) {
          group_id = _.head(user.groups);
          new Promise(function (resolve, reject) {
            request["delete"](user_url + "/".concat(user._id, "/groups/").concat(group_id)).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            return new Promise(function (resolve, reject) {
              request["delete"](user_url + "/".concat(user._id, "/groups/").concat(group_id)).end(function (err, res) {
                return resolve(res);
              });
            });
          }).then(function (res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.group_id).equal(expected.detail);
          done();
        });
      });
    });
  }); // メニューロールの変更

  describe("patch /:user_id/role_menus", function () {
    var otherUser;
    var role_id;
    before(function (done) {
      new Promise(function (resolve, reject) {
        // 自分以外のユーザを取得
        request.get(user_url).end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        otherUser = _.head(res.body.body.filter(function (_user) {
          return _user._id !== user._id;
        })); // role_menu付きのユーザオブジェクトが欲しいので

        return new Promise(function (resolve, reject) {
          request.get(user_url + "/".concat(otherUser._id)).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        otherUser = res.body.body; // role_menu一覧

        return new Promise(function (resolve, reject) {
          request.get("/api/v1/role_menus").end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        role_id = res.body.body.filter(function (role) {
          return role._id !== otherUser.role_id;
        })[0]._id;
        done();
      });
    });
    describe("user_id, 追加したいrole_menu_idを正しく指定した場合", function () {
      var payload;
      var nextPayload;
      before(function (done) {
        // メニューロール変更
        new Promise(function (resolve, reject) {
          request.patch(user_url + "/".concat(otherUser._id, "/role_menus")).send({
            role_menu_id: role_id
          }).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res; // 反映されているかどうか

          return new Promise(function (resolve, reject) {
            request.get(user_url + "/".concat(otherUser._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("変更したユーザを取得した場合、追加したロールメニューを含めた結果が返却される", function (done) {
        (0, _chai.expect)(nextPayload.body.body.role_id).equal(role_id);
        done();
      });
    });
    describe("指定されたuser_idが", function () {
      describe("存在しないoidの場合", function () {
        var payload;
        var expected = {
          message: "メニュー権限の変更に失敗しました",
          detail: "ユーザIDが不正のためメニュー権限の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/invalid_oid/role_menus").send({
            role_menu_id: role_id
          }).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.user_id).equal(expected.detail);
          done();
        });
      });
    });
    describe("指定されたrole_menu_idが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body = {};
        var expected = {
          message: "メニュー権限の変更に失敗しました",
          detail: "メニュー権限IDが空のためメニュー権限の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/role_menus")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.role_menu_id).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body = {
          role_menu_id: null
        };
        var expected = {
          message: "メニュー権限の変更に失敗しました",
          detail: "メニュー権限IDが空のためメニュー権限の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/role_menus")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.role_menu_id).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body = {
          role_menu_id: ""
        };
        var expected = {
          message: "メニュー権限の変更に失敗しました",
          detail: "メニュー権限IDが空のためメニュー権限の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/role_menus")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.role_menu_id).equal(expected.detail);
          done();
        });
      });
      describe("存在しないoidの場合", function () {
        var payload;
        var body = {
          role_menu_id: "invalid_oid"
        };
        var expected = {
          message: "メニュー権限の変更に失敗しました",
          detail: "メニュー権限IDが不正のためメニュー権限の変更に失敗しました"
        };
        before(function (done) {
          request.patch(user_url + "/".concat(user._id, "/role_menus")).send(body).end(function (err, res) {
            payload = res;
            done();
          });
        });
        it("http(400)が返却される", function (done) {
          (0, _chai.expect)(payload.status).equal(400);
          done();
        });
        it("statusはfalse", function (done) {
          (0, _chai.expect)(payload.body.status.success).equal(false);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.role_menu_id).equal(expected.detail);
          done();
        });
      });
    });
  });
});