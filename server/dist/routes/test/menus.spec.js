"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _supertest = _interopRequireDefault(require("supertest"));

var _superagentDefaults = _interopRequireDefault(require("superagent-defaults"));

var _chai = require("chai");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _ = _interopRequireDefault(require("../"));

var _lodash = require("lodash");

var _builder = require("./builder");

_mongoose["default"].connect(_builder.mongoUrl, {
  useMongoClient: true
});

_builder.app.use('/', _["default"]);

var base_url = "/api/v1/menus";
var login_url = "/api/login";
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
var tenant_id = "";
describe(base_url, function () {
  before(function (done) {
    _builder.initdbPromise.then(function () {
      request.post(login_url).send(_builder.authData).end(function (err, res) {
        tenant_id = res.body.body.user.tenant_id;
        request.set('x-auth-cloud-storage', res.body.body.token);
        done();
      });
    });
  });
  describe('get /', function () {
    describe('正常系', function () {
      var response;
      before(function (done) {
        request.get(base_url).end(function (err, res) {
          response = res;
          done();
        });
      });
      it('http(200)が返却される', function (done) {
        (0, _chai.expect)(response.status).equal(200);
        done();
      });
      it('statusはtrue', function (done) {
        (0, _chai.expect)(response.body.status.success).equal(true);
        done();
      });
      it('返却値はobjectである', function (done) {
        (0, _chai.expect)((0, _typeof2["default"])(response.body.body)).equal('object');
        done();
      });
      it('_idが含まれる', function (done) {
        (0, _chai.expect)((0, _lodash.has)(response.body.body[0], '_id')).equal(true);
        done();
      });
      it('_idはObjectIdである', function (done) {
        (0, _chai.expect)(_mongoose["default"].Types.ObjectId.isValid(response.body.body[0]._id)).equal(true);
        done();
      });
      it('nameが含まれる', function (done) {
        (0, _chai.expect)((0, _lodash.has)(response.body.body[0], 'name')).equal(true);
        done();
      });
      it('nameはstringである', function (done) {
        (0, _chai.expect)((0, _typeof2["default"])(response.body.body[0].name)).equal('string');
        done();
      });
      it('labelが含まれる', function (done) {
        (0, _chai.expect)((0, _lodash.has)(response.body.body[0], 'label')).equal(true);
        done();
      });
      it('labelはstringである', function (done) {
        (0, _chai.expect)((0, _typeof2["default"])(response.body.body[0].label)).equal('string');
        done();
      });
    });
  });
});