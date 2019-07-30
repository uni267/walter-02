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

var helper = _interopRequireWildcard(require("./helper"));

_mongoose["default"].connect(_builder.mongoUrl, {
  useMongoClient: true
});

_builder.app.use("/", _2["default"]);

var ObjectId = _mongoose["default"].Types.ObjectId;
var files_url = "/api/v1/files";
var login_url = "/api/login";
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
describe(files_url, function () {
  var user;
  var body = {
    files: [{
      name: "test.txt",
      size: 4,
      mime_type: "text/plain",
      base64: "data:text/plain;base64,Zm9vCg==",
      checksum: "8f3bee6fbae63be812de5af39714824e"
    }]
  };
  before(function (done) {
    _builder.initdbPromise.then(function () {
      new Promise(function (resolve, reject) {
        request.post(login_url).send(_builder.authData).end(function (err, res) {
          request.set("x-auth-cloud-storage", res.body.body.token);
          resolve(res);
        });
      }).then(function (res) {
        user = res.body.body.user;
        done();
      });
    });
  });
  describe("patch /:file_id/toggle_star", function () {
    describe("正しいfile_idを指定した場合", function () {
      var file;
      var payload;
      var nextPayload;
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.head(res.body.body);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(file._id, "/toggle_star")).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(file._id, "/toggle_star")).end(function (err, res) {
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
      it("作成時、is_starはfalseになっている", function (done) {
        (0, _chai.expect)(file.is_star).equal(false);
        done();
      });
      it("トグル実行後、is_starはfalse -> trueになっている", function (done) {
        (0, _chai.expect)(payload.body.body.is_star).equal(true);
        done();
      });
      it("再度トグル実行後、is_starはtrue -> falseになっている", function (done) {
        (0, _chai.expect)(nextPayload.body.body.is_star).equal(false);
        done();
      });
    });
    describe("file_idがoid形式ではない場合", function () {
      var file;
      var payload;
      var expected = {
        message: "ファイルのお気に入りの設定に失敗しました",
        detail: "ファイルIDが不正のためファイルのお気に入りの設定に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.head(res.body.body);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/invalid_oid/toggle_star").end(function (err, res) {
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
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
    describe("file_idが存在しないidの場合", function () {
      var file;
      var payload;
      var expected = {
        message: "ファイルのお気に入りの設定に失敗しました",
        detail: "指定されたファイルが存在しないためファイルのお気に入りの設定に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.head(res.body.body);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(ObjectId(), "/toggle_star")).end(function (err, res) {
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
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
  });
});