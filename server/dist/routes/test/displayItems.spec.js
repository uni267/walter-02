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

var ObjectId = _mongoose["default"].Types.ObjectId;
var items_url = "/api/v1/display_items";
var login_url = "/api/login";
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
var user;
describe(items_url, function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      new Promise(function (resolve, reject) {
        request.post(login_url).send(_builder.authData).end(function (err, res) {
          request.set("x-auth-cloud-storage", res.body.body.token);
          resolve(res);
        });
      }).then(function (res) {
        var user_id = res.body.body._id;
        return new Promise(function (resolve, reject) {
          request.get("/api/v1/users/".concat(user_id)).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        user = res.body.body;
        done();
      });
    });
  });
  describe("get /", function () {
    var payload;
    before(function (done) {
      request.get(items_url).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("successはtrue", function (done) {
      (0, _chai.expect)(payload.body.status.success).equal(true);
      done();
    });
    it("必要なカラムを含んでいる", function (done) {
      var needle = ["_id", "tenant_id", "meta_info_id", "label", "name", "is_display", "order", "width"];
      var columns = payload.body.body.map(function (item) {
        return _.keys(item);
      }).map(function (keys) {
        return _.intersection(keys, needle);
      }).map(function (keys) {
        return keys.length === needle.length;
      });
      (0, _chai.expect)(columns.every(function (b) {
        return b === true;
      })).equal(true);
      done();
    });
  });
  describe("get /excels", function () {
    var payload;
    before(function (done) {
      request.get(items_url + "/excels").end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("必要なカラムを含んでいる", function (done) {
      var needle = ["_id", "tenant_id", "meta_info_id", "label", "name", "is_display", "is_excel", "order"];
      var columns = payload.body.body.map(function (item) {
        return _.keys(item);
      }).map(function (keys) {
        return _.intersection(keys, needle);
      }).map(function (keys) {
        return keys.length === needle.length;
      });
      (0, _chai.expect)(columns.every(function (b) {
        return b === true;
      })).equal(true);
      done();
    });
    it("is_excelはtrue", function (done) {
      var isExcels = payload.body.body.map(function (item) {
        return item.is_excel;
      });
      (0, _chai.expect)(isExcels.every(function (excel) {
        return excel === true;
      })).equal(true);
      done();
    });
    it("orderは昇順", function (done) {
      var payloadIds = payload.body.body.map(function (b) {
        return b._id;
      }).join(",");

      var lodashIds = _.sortBy(payload.body.body, function (o) {
        return o.order;
      }).map(function (b) {
        return b._id;
      }).join(",");

      (0, _chai.expect)(payloadIds).equal(lodashIds);
      done();
    });
  });
});