"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _supertest = _interopRequireDefault(require("supertest"));

var _superagentDefaults = _interopRequireDefault(require("superagent-defaults"));

var _chai = require("chai");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _ = _interopRequireDefault(require("../"));

var _lodash = require("lodash");

var _builder = require("./builder");

var base_url = "/api/v1/actions";
var login_url = "/api/login";

_mongoose["default"].connect(_builder.mongoUrl, {
  useMongoClient: true
});

_builder.app.use("/", _["default"]);

var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
var auth;
describe(base_url, function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      request.post(login_url).send(_builder.authData).end(function (err, res) {
        request.set("x-auth-cloud-storage", res.body.body.token);
        done();
      });
    });
  });
  describe("get /", function () {
    var payload;
    before(function (done) {
      request.get(base_url).end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("10件以上のオブジェクトが返却される", function (done) {
      (0, _chai.expect)(payload.body.body.length > 10).equal(true);
      done();
    });
    it("返却されるオブジェクトは_id, name, labelカラムを含んでいる", function (done) {
      var needle = ["_id", "name", "label"];
      var columns = payload.body.body.map(function (o) {
        return (0, _lodash.intersection)(Object.keys(o), needle).length === needle.length;
      });
      (0, _chai.expect)(columns.every(function (col) {
        return col === true;
      })).equal(true);
      done();
    });
    it("返却されるオブジェクトの_id, name, labelカラムは0文字以上", function (done) {
      var columns = payload.body.body.map(function (obj) {
        return obj._id.length > 0 && obj.name.length > 0 && obj.label.length > 0;
      });
      (0, _chai.expect)(columns.every(function (col) {
        return col === true;
      })).equal(true);
      done();
    });
    it("nameカラムはuniqueなもの", function (done) {
      var names = payload.body.body.map(function (obj) {
        return obj.name;
      });
      (0, _chai.expect)((0, _lodash.uniq)(names).length).equal(names.length);
      done();
    });
    it("labelカラムはuniqueなもの", function (done) {
      var labels = payload.body.body.map(function (obj) {
        return obj.label;
      });
      (0, _chai.expect)((0, _lodash.uniq)(labels).length).equal(labels.length);
      done();
    });
  });
});