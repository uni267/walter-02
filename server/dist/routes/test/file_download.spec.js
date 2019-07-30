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
var user;
describe(files_url, function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      new Promise(function (resolve, reject) {
        request.post(login_url).send(_builder.authData).end(function (err, res) {
          request.set("x-auth-cloud-storage", res.body.body.token);
          resolve(res);
        });
      }).then(function (res) {
        var user_id = res.body.body.user._id;
        return new Promise(function (resolve, reject) {
          request.get("/api/v1/users/".concat(user_id)).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        user = res.body.body;
        var body = {
          files: [{
            name: "test.txt",
            size: 4,
            mime_type: "text/plain",
            base64: "data:text/plain;base64,Zm9vCg==",
            checksum: "8f3bee6fbae63be812de5af39714824e"
          }]
        };
        return new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            resolve(res);
          });
        });
      }).then(function (res) {
        return done();
      });
    });
  });
  describe("存在するファイルidを指定した場合", function () {
    var payload;
    var file;
    before(function (done) {
      request.get(files_url).end(function (err, res) {
        payload = res;
        file = _.get(payload, ["body", "body", "0"]);
        request.get(files_url + "/download").query({
          file_id: file._id
        }).buffer().parse(helper.binaryParser).end(function (err, res) {
          payload = res;
          done();
        });
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("ダウンロードしたファイルはバッファ型", function (done) {
      (0, _chai.expect)(Buffer.isBuffer(payload.body)).equal(true);
      done();
    });
    it("バッファを文字列にキャストした場合、空ではない", function (done) {
      (0, _chai.expect)(payload.body.toString().length > 0).equal(true);
      done();
    });
  });
  describe("ファイルidがundefinedの場合", function () {
    var payload;
    var file;
    var expected = {
      message: "ファイルのダウンロードに失敗しました",
      detail: "ファイルIDが空のためファイルのダウンロードに失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/download").buffer().parse(helper.binaryParser).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("successはfalse", function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.success).equal(false);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.errors.file_id).equal(expected.detail);
      done();
    });
  });
  describe("ファイルidがnullの場合", function () {
    var payload;
    var file;
    var expected = {
      message: "ファイルのダウンロードに失敗しました",
      detail: "ファイルIDが空のためファイルのダウンロードに失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/download").query({
        file_id: null
      }).buffer().parse(helper.binaryParser).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("successはfalse", function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.success).equal(false);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.errors.file_id).equal(expected.detail);
      done();
    });
  });
  describe("ファイルidが空文字の場合", function () {
    var payload;
    var file;
    var expected = {
      message: "ファイルのダウンロードに失敗しました",
      detail: "ファイルIDが空のためファイルのダウンロードに失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/download").query({
        file_id: ""
      }).buffer().parse(helper.binaryParser).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("successはfalse", function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.success).equal(false);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.errors.file_id).equal(expected.detail);
      done();
    });
  });
  describe("ファイルidがoid形式ではない場合", function () {
    var payload;
    var file;
    var expected = {
      message: "ファイルのダウンロードに失敗しました",
      detail: "ファイルIDが不正のためファイルのダウンロードに失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/download").query({
        file_id: "invalid_oid"
      }).buffer().parse(helper.binaryParser).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("successはfalse", function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.success).equal(false);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.errors.file_id).equal(expected.detail);
      done();
    });
  });
  describe("ファイルidが存在しないoidの場合", function () {
    var payload;
    var file;
    var expected = {
      message: "ファイルのダウンロードに失敗しました",
      detail: "指定されたファイルが存在しないためファイルのダウンロードに失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/download").query({
        file_id: new ObjectId().id.toString()
      }).buffer().parse(helper.binaryParser).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("successはfalse", function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.success).equal(false);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(JSON.parse(payload.body.toString()).status.errors.file_id).equal(expected.detail);
      done();
    });
  });
});