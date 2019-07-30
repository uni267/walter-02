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
  describe("メタ情報の追加 post /:file_id/meta", function () {
    var meta;
    var file;
    before(function (done) {
      new Promise(function (resolve, reject) {
        request.get("/api/v1/meta_infos").end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        meta = _.get(res, ["body", "body", "0"]);
        return new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        file = _.get(res, ["body", "body", "0"]);
        done();
      });
    });
    describe("正しいファイルid, メタ情報id, 値を指定した場合", function () {
      var payload;
      var nextPayload;
      var value = "test value";
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
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
        (0, _chai.expect)(nextPayload.status).equal(200);
        done();
      });
      it("指定したmeta_id, valueが登録されている", function (done) {
        var _meta = _.get(nextPayload, ["body", "body", "meta_infos", "0"]);

        (0, _chai.expect)(_meta._id).equal(meta._id);
        (0, _chai.expect)(_meta.value).equal(value);
        done();
      });
    });
    describe("ファイルidがoid形式ではない場合", function () {
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "ファイルIDが不正のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/invalid_oid/meta").send({
            meta: meta,
            value: value
          }).end(function (err, res) {
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
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(ObjectId(), "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidがundefinedの場合", function () {
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報IDが空のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: {},
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidがnullの場合", function () {
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報IDが空のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: {
              _id: null
            },
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidがoid形式ではない場合", function () {
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報IDが不正のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: {
              _id: "invalid_oid"
            },
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidが存在しない場合", function () {
      var payload;
      var value = "test value";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "指定されたメタ情報が存在しないためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: {
              _id: file._id
            },
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_id).equal(expected.detail);
        done();
      });
    });
    describe("メタの値がundefinedの場合", function () {
      var payload;
      var value;
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報の値が空のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_value).equal(expected.detail);
        done();
      });
    });
    describe("メタの値がnullの場合", function () {
      var payload;
      var value = null;
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報の値が空のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_value).equal(expected.detail);
        done();
      });
    });
    describe("メタの値が空文字の場合", function () {
      var payload;
      var value = "";
      var expected = {
        message: "メタ情報の追加に失敗しました",
        detail: "メタ情報の値が空のためメタ情報の追加に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.metainfo_value).equal(expected.detail);
        done();
      });
    });
    describe("メタidが既に登録されている場合", function () {
      var value = "test";
      var overValue = value + value;
      var payload;
      var nextPayload;
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url + "/".concat(file._id, "/meta")).send({
            meta: meta,
            value: value
          }).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          return new Promise(function (resolve, reject) {
            request.post(files_url + "/".concat(file._id, "/meta")).send({
              meta: meta,
              value: overValue
            }).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
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
      it("2重登録されない", function (done) {
        var _meta = nextPayload.body.body.meta_infos.filter(function (_meta) {
          return _meta._id === meta._id;
        });

        (0, _chai.expect)(_meta.length === 1).equal(true);
        done();
      });
      it("指定された値で上書きされる", function (done) {
        var _meta = nextPayload.body.body.meta_infos.filter(function (_meta) {
          return _meta._id === meta._id;
        });

        (0, _chai.expect)(_.head(_meta).value).equal(overValue);
        done();
      });
    });
  });
  describe("メタ情報の削除 delete /:file_id/meta/:meta_id", function () {
    var file;
    var meta;
    var value = "test value";
    before(function (done) {
      new Promise(function (resolve, reject) {
        request.get("/api/v1/meta_infos").end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        meta = _.get(res, ["body", "body", "0"]);
        body.files[0].meta_infos = [{
          _id: meta._id,
          value: value
        }];
        return new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        var file_id = _.get(res, ["body", "body", "0", "_id"]);

        return new Promise(function (resolve, reject) {
          request.get(files_url + "/".concat(file_id)).end(function (err, res) {
            return resolve(res);
          });
        });
      }).then(function (res) {
        file = res.body.body;
        done();
      });
    });
    describe("正しいファイルid, メタidを指定した場合", function () {
      var payload;
      var nextPayload;
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/".concat(file._id, "/meta/").concat(meta._id)).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
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
      it("指定したメタ情報が削除されている", function (done) {
        var _meta = nextPayload.body.body.meta_infos.filter(function (meta) {
          return meta._id === meta._id;
        });

        (0, _chai.expect)(_meta.length === 0).equal(true);
        done();
      });
    });
    describe("ファイルidがoid形式ではない場合", function () {
      var payload;
      var nextPayload;
      var expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "ファイルIDが不正のためメタ情報の削除に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/invalid_oid/meta/".concat(meta._id)).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
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
      var payload;
      var nextPayload;
      var expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたファイルが存在しないためメタ情報の削除に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/".concat(meta._id, "/meta/").concat(meta._id)).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
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
    describe("メタidがoid形式ではない場合", function () {
      var payload;
      var nextPayload;
      var expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "メタ情報IDが不正のためメタ情報の削除に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/".concat(file._id, "/meta/invalid_oid")).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
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
        (0, _chai.expect)(payload.body.status.errors.meta_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidがマスタに存在しない場合", function () {
      var payload;
      var nextPayload;
      var expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたメタ情報が存在しないためメタ情報の削除に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/".concat(file._id, "/meta/").concat(ObjectId())).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          payload = res;
          return new Promise(function (resolve, reject) {
            request.get(files_url + "/".concat(file._id)).end(function (err, res) {
              return resolve(res);
            });
          });
        }).then(function (res) {
          nextPayload = res;
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
        (0, _chai.expect)(payload.body.status.errors.meta_id).equal(expected.detail);
        done();
      });
    });
    describe("メタidがファイルに存在しない場合", function () {
      var payload;
      var expected = {
        message: "メタ情報の削除に失敗しました",
        detail: "指定されたメタ情報IDがファイルに存在しないためメタ情報の削除に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request["delete"](files_url + "/".concat(file._id, "/meta/").concat(meta._id)).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          return new Promise(function (resolve, reject) {
            request["delete"](files_url + "/".concat(file._id, "/meta/").concat(meta._id)).end(function (err, res) {
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
        (0, _chai.expect)(payload.body.status.errors.meta_id).equal(expected.detail);
        done();
      });
    });
  });
});