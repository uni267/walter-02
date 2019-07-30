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
describe(files_url + "/search_items", function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      new Promise(function (resolve, reject) {
        request.post(login_url).send(_builder.authData).end(function (err, res) {
          request.set("x-auth-cloud-storage", res.body.body.token);
          resolve(res);
        });
      }).then(function (res) {
        var user_id = res.body.body.user._id;
        done();
      });
    });
  });
  describe("queryなしで取得した場合", function () {
    var payload;
    before(function (done) {
      request.get(files_url + "/search_items").end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("返却されるオブジェクトは1以上の配列", function (done) {
      (0, _chai.expect)(payload.body.body.length > 0).equal(true);
      done();
    });
    it("返却されるオブジェクトは「_id, tenant_id, label, name, meta_info_id」を含む", function (done) {
      var needle = ["_id", "tenant_id", "label", "name", "meta_info_id"];
      var columns = payload.body.body.map(function (obj) {
        return _.intersection(_.keys(obj), needle);
      }).map(function (keys) {
        return keys.length === needle.length;
      });
      (0, _chai.expect)(columns.every(function (col) {
        return col === true;
      })).equal(true);
      done();
    });
  });
  describe("queryにmeta_only=trueを指定した場合", function () {
    var payload;
    before(function (done) {
      request.get(files_url + "/search_items").query({
        meta_only: true
      }).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("返却されるオブジェクトは1以上の配列", function (done) {
      (0, _chai.expect)(payload.body.body.length > 0).equal(true);
      done();
    });
    it("返却されるオブジェクトは「_id, tenant_id, label, name, value_type」を含む", function (done) {
      var needle = ["_id", "tenant_id", "label", "name", "value_type"];
      var columns = payload.body.body.map(function (obj) {
        return _.intersection(_.keys(obj), needle);
      }).map(function (keys) {
        return keys.length === needle.length;
      });
      (0, _chai.expect)(columns.every(function (col) {
        return col === true;
      })).equal(true);
      done();
    });
  });
  describe("queryにmeta_only=bool以外の値を指定した場合", function () {
    var payload;
    var expected = {
      message: "検索項目の取得に失敗しました",
      detail: "指定したオプションが真偽値以外のため検索項目の取得に失敗しました"
    };
    before(function (done) {
      request.get(files_url + "/search_items").query({
        meta_only: "invalid_params"
      }).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(400)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(400);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
      (0, _chai.expect)(payload.body.status.message).equal(expected.message);
      done();
    });
    it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
      (0, _chai.expect)(payload.body.status.errors.meta_only).equal(expected.detail);
      done();
    });
  });
});