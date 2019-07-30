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
describe("patch " + files_url + "/:file_id/rename", function () {
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
        var user_id = res.body.body.user._id;
        done();
      });
    });
  });
  describe("正しいファイルid、ファイル名を指定した場合", function () {
    var payload;
    var file;
    var changedName;
    before(function (done) {
      new Promise(function (resolve, reject) {
        request.post(files_url).send(body).end(function (err, res) {
          return resolve(res);
        });
      }).then(function (res) {
        file = _.get(res, ["body", "body", "0"]);
        changedName = "rename_" + file.name;
        return new Promise(function (resolve, reject) {
          request.patch(files_url + "/".concat(file._id, "/rename")).send({
            name: changedName
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
    it("返却される値は変更されたファイル名", function (done) {
      (0, _chai.expect)(_.get(payload, ["body", "body", "name"])).equal(changedName);
      done();
    });
  });
  describe("ファイルidが", function () {
    describe("oid形式ではない場合", function () {
      var payload;
      var file;
      var expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイルIDが不正のためファイル名の変更に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/invalid_oid/rename").send({
              name: "foobar"
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
      var file;
      var expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "指定されたファイルが存在しないためファイル名の変更に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(user._id, "/rename")).send({
              name: "foobar"
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
  describe("ファイル名が", function () {
    describe("undefinedの場合", function () {
      var payload;
      var file;
      var expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空のためファイル名の変更に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(file._id, "/rename")).send().end(function (err, res) {
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
        (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
        done();
      });
    });
    describe("nullの場合", function () {
      var payload;
      var file;
      var expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空のためファイル名の変更に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(file._id, "/rename")).send({
              name: null
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
        (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
        done();
      });
    });
    describe("空文字の場合", function () {
      var payload;
      var file;
      var expected = {
        message: "ファイル名の変更に失敗しました",
        detail: "ファイル名が空のためファイル名の変更に失敗しました"
      };
      before(function (done) {
        new Promise(function (resolve, reject) {
          request.post(files_url).send(body).end(function (err, res) {
            return resolve(res);
          });
        }).then(function (res) {
          file = _.get(res, ["body", "body", "0"]);
          return new Promise(function (resolve, reject) {
            request.patch(files_url + "/".concat(file._id, "/rename")).send({
              name: ""
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
        (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
        done();
      });
    });
    describe("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", function () {
      describe("バックスラッシュ", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "\\foo\\bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("スラッシュ", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "/foo/bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("コロン", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: ":foo:bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("アスタリスク", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "*foo*bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("クエスチョン", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "?foo?bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("山括弧開く", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "<foo<bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("山括弧閉じる", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: ">foo>bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
      describe("パイプ", function () {
        var payload;
        var file;
        var expected = {
          message: "ファイル名の変更に失敗しました",
          detail: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました"
        };
        before(function (done) {
          new Promise(function (resolve, reject) {
            request.post(files_url).send(body).end(function (err, res) {
              return resolve(res);
            });
          }).then(function (res) {
            file = _.get(res, ["body", "body", "0"]);
            return new Promise(function (resolve, reject) {
              request.patch(files_url + "/".concat(file._id, "/rename")).send({
                name: "|foo|bar"
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
          (0, _chai.expect)(payload.body.status.errors.file_name).equal(expected.detail);
          done();
        });
      });
    });
  });
});