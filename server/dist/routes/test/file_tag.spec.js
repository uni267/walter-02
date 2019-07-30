"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _util = _interopRequireDefault(require("util"));

var _supertest = _interopRequireDefault(require("supertest"));

var _superagentDefaults = _interopRequireDefault(require("superagent-defaults"));

var _chai = require("chai");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _2 = _interopRequireDefault(require("../"));

var _ = _interopRequireWildcard(require("lodash"));

var _builder = require("./builder");

var helper = _interopRequireWildcard(require("./helper"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  describe("タグ追加(post /:file_id/tags)", function () {
    var tag;
    before(function (done) {
      request.get("/api/v1/tags").end(function (err, res) {
        tag = _.get(res, ["body", "body", "0"]);
        done();
      });
    });
    describe("正しいファイルid, タグidを指定した場合", function () {
      var createdFile;
      var payload;
      before(function (done) {
        request.post(files_url).send(body).end(function (err, res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          request.post(files_url + "/".concat(createdFile._id, "/tags")).send(tag).end(function (err, res) {
            payload = res;
            done();
          });
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("返却されるオブジェクトに追加したタグidが含まれている", function (done) {
        var matched = _.get(payload, ["body", "body", "tags"]).filter(function (_tag) {
          return _tag._id === tag._id;
        });

        (0, _chai.expect)(matched.length === 1).equal(true);
        done();
      });
    });
    describe("ファイルidがoid形式ではない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの追加に失敗しました",
        detail: "ファイルIDが不正のためタグの追加に失敗しました"
      };
      before(function (done) {
        request.post(files_url).send(body).end(function (err, res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          request.post(files_url + "/invalid_oid/tags").send(tag).end(function (err, res) {
            payload = res;
            done();
          });
        });
      });
      it("http(400)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(400);
        done();
      });
      it("successはfalse", function (done) {
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
    describe("ファイルidが存在しない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの追加に失敗しました",
        detail: "指定されたファイルが存在しないためタグの追加に失敗しました"
      };
      before(function (done) {
        request.post(files_url).send(body).end(function (err, res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          request.post(files_url + "/".concat(ObjectId(), "/tags")).send(tag).end(function (err, res) {
            payload = res;
            done();
          });
        });
      });
      it("http(400)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(400);
        done();
      });
      it("successはfalse", function (done) {
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
    describe("タグidがoid形式ではない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの追加に失敗しました",
        detail: "タグIDが不正のためタグの追加に失敗しました"
      };
      before(function (done) {
        request.post(files_url).send(body).end(function (err, res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          request.post(files_url + "/".concat(createdFile._id, "/tags")).send(_objectSpread({}, tag, {
            _id: "invalid_id"
          })).end(function (err, res) {
            payload = res;
            done();
          });
        });
      });
      it("http(400)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(400);
        done();
      });
      it("successはfalse", function (done) {
        (0, _chai.expect)(payload.body.status.success).equal(false);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.tag_id).equal(expected.detail);
        done();
      });
    });
    describe("タグidが存在しない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの追加に失敗しました",
        detail: "指定されたタグが存在しないためタグの追加に失敗しました"
      };
      before(function (done) {
        request.post(files_url).send(body).end(function (err, res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          request.post(files_url + "/".concat(createdFile._id, "/tags")).send(_objectSpread({}, tag, {
            _id: ObjectId()
          })).end(function (err, res) {
            payload = res;
            done();
          });
        });
      });
      it("http(400)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(400);
        done();
      });
      it("successはfalse", function (done) {
        (0, _chai.expect)(payload.body.status.success).equal(false);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.tag_id).equal(expected.detail);
        done();
      });
    });
  });
  describe("タグ削除(delete /:file_id/tags/:tag_id)", function () {
    var tag;
    before(function (done) {
      request.get("/api/v1/tags").end(function (err, res) {
        tag = _.get(res, ["body", "body", "0"]);
        done();
      });
    });
    describe("正しいファイルid, タグidを指定した場合", function () {
      var createdFile;
      var payload;
      before(function (done) {
        var _body = _.clone(body);

        _body.files[0].tags = [tag._id];
        new Promise(function (resolve, reject) {
          request.post(files_url).send(_body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/".concat(createdFile._id, "/tags/").concat(tag._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          payload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      it("返却されるオブジェクトに追加したタグidが含まれていない", function (done) {
        var matched = _.get(payload, ["body", "body", "tags"]).filter(function (_tag) {
          return _tag._id === tag._id;
        });

        (0, _chai.expect)(matched.length === 0).equal(true);
        done();
      });
    });
    describe("ファイルidがoid形式ではない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの削除に失敗しました",
        detail: "ファイルIDが不正のためタグの削除に失敗しました"
      };
      before(function (done) {
        var _body = _.clone(body);

        _body.files[0].tags = [tag._id];
        new Promise(function (resolve, reject) {
          request.post(files_url).send(_body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/invalid_id/tags/".concat(tag._id)).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
    describe("ファイルidが存在しない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの削除に失敗しました",
        detail: "指定されたファイルが存在しないためタグの削除に失敗しました"
      };
      before(function (done) {
        var _body = _.clone(body);

        _body.files[0].tags = [tag._id];
        new Promise(function (resolve, reject) {
          request.post(files_url).send(_body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/".concat(ObjectId(), "/tags/").concat(tag._id)).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
    describe("タグidがoid形式ではない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの削除に失敗しました",
        detail: "タグIDが不正のためタグの削除に失敗しました"
      };
      before(function (done) {
        var _body = _.clone(body);

        _body.files[0].tags = [tag._id];
        new Promise(function (resolve, reject) {
          request.post(files_url).send(_body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/".concat(createdFile._id, "/tags/invalid_id")).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.tag_id).equal(expected.detail);
        done();
      });
    });
    describe("タグidが存在しない場合", function () {
      var createdFile;
      var payload;
      var expected = {
        message: "タグの削除に失敗しました",
        detail: "指定されたタグが存在しないためタグの削除に失敗しました"
      };
      before(function (done) {
        var _body = _.clone(body);

        _body.files[0].tags = [tag._id];
        new Promise(function (resolve, reject) {
          request.post(files_url).send(_body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/".concat(createdFile._id, "/tags/").concat(ObjectId())).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.tag_id).equal(expected.detail);
        done();
      });
    });
  });
});