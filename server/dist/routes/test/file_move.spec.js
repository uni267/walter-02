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
describe("patch " + files_url + "/:file_id/move", function () {
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
  describe("正しいfile_id, dir_idを指定した場合", function () {
    var payload;
    var createdFile;
    before(function (done) {
      new Promise(function (resolve, reject) {
        request.post(files_url).send(body).end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        createdFile = _.get(res, ["body", "body", "0"]);
        return new Promise(function (resolve, reject) {
          request.patch(files_url + "/".concat(createdFile._id, "/move")).send({
            dir_id: user.tenant.trash_dir_id
          }).end(function (err, res) {
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
    it("返却された値は移動後のdir_idとなっている", function (done) {
      (0, _chai.expect)(payload.body.body.dir_id).equal(user.tenant.trash_dir_id);
      done();
    });
  });
  describe("file_idが", function () {
    describe("oid形式ではない場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "ファイルIDが不正のためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/invalid_oid/move").send({
              dir_id: user.tenant.trash_dir_id
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.file_id).equal(expected.detail);
        done();
      });
    });
    describe("存在しないidの場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "指定されたファイルが存在しないためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(user._id, "/move")).send({
              dir_id: user.tenant.trash_dir_id
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
  describe("dir_idが", function () {
    describe("undefinedの場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "フォルダIDが空のためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(createdFile._id, "/move")).send().end(function (err, res) {
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
        (0, _chai.expect)(payload.body.status.errors.dir_id).equal(expected.detail);
        done();
      });
    });
    describe("nullの場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "フォルダIDが空のためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(createdFile._id, "/move")).send({
              dir_id: null
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.dir_id).equal(expected.detail);
        done();
      });
    });
    describe("空文字の場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "フォルダIDが空のためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(createdFile._id, "/move")).send({
              dir_id: ""
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.dir_id).equal(expected.detail);
        done();
      });
    });
    describe("oid形式ではない場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "フォルダIDが不正のためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(createdFile._id, "/move")).send({
              dir_id: "invalid_oid"
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.dir_id).equal(expected.detail);
        done();
      });
    });
    describe("存在しないidの場合", function () {
      var payload;
      var createdFile;
      var expected = {
        message: "ファイルの移動に失敗しました",
        detail: "指定されたフォルダが存在しないためファイルの移動に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          createdFile = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(createdFile._id, "/move")).send({
              dir_id: user._id
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
      it("\u30A8\u30E9\u30FC\u306E\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.message).equal(expected.message);
        done();
      });
      it("\u30A8\u30E9\u30FC\u306E\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
        (0, _chai.expect)(payload.body.status.errors.dir_id).equal(expected.detail);
        done();
      });
    });
  });
});