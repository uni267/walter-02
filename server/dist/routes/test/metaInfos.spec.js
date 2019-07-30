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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

_mongoose["default"].connect(_builder.mongoUrl, {
  useMongoClient: true
});

_builder.app.use("/", _2["default"]);

var ObjectId = _mongoose["default"].Types.ObjectId;
var meta_infos_url = "/api/v1/meta_infos";
var login_url = "/api/login";
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(_builder.app));
var user;
describe(meta_infos_url, function () {
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
        done();
      });
    });
  });
  describe("get /", function () {
    var payload;
    before(function (done) {
      request.get(meta_infos_url).end(function (err, res) {
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
      var needle = ["_id", "tenant_id", "name", "value_type"];
      var columns = payload.body.body.map(function (meta) {
        return _.keys(meta);
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
    describe("metaInfoオジェクトの型", function () {
      var metaInfo;
      before(function (done) {
        metaInfo = _.head(payload.body.body);
        done();
      });
      it("_idはmongo oid型", function (done) {
        (0, _chai.expect)(_mongoose["default"].Types.ObjectId.isValid(metaInfo._id)).equal(true);
        done();
      });
      it("tenant_idはmongo oid型", function (done) {
        (0, _chai.expect)(_mongoose["default"].Types.ObjectId.isValid(metaInfo.tenant_id)).equal(true);
        done();
      });
      it("nameは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.name.length > 0).equal(true);
        done();
      });
      it("labelは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.label.length > 0).equal(true);
        done();
      });
      it("value_typeは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.value_type.length > 0).equal(true);
        done();
      });
    });
  });
  describe("get /value_type", function () {
    var payload;
    before(function (done) {
      request.get(meta_infos_url + "/value_type").end(function (err, res) {
        payload = res;
        done();
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("必要なカラムを含んでいる", function (done) {
      var needle = ["name"];
      var columns = payload.body.status.value_type.map(function (meta) {
        return _.keys(meta);
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
    it("value_typeオジェクトにnameが含まれており0文字以上の文字列", function (done) {
      var value_type = _.head(payload.body.status.value_type);

      (0, _chai.expect)(value_type.name.length > 0).equal(true);
      done();
    });
  });
  describe("get /:meta_info_id", function () {
    var payload;
    before(function (done) {
      request.get(meta_infos_url).end(function (err, res) {
        var meta_info = _.head(res.body.body);

        request.get(meta_infos_url + "/".concat(meta_info._id)).end(function (err, res) {
          payload = res;
          done();
        });
      });
    });
    it("http(200)が返却される", function (done) {
      (0, _chai.expect)(payload.status).equal(200);
      done();
    });
    it("必要なカラムを含んでいる", function (done) {
      var needle = ["_id", "tenant_id", "name", "value_type"];

      var columns = _.chain(payload.body.body).keys().intersection(needle).value();

      (0, _chai.expect)(columns.length === needle.length).equal(true);
      done();
    });
    describe("metaInfoオジェクトの型", function () {
      var metaInfo;
      before(function (done) {
        metaInfo = payload.body.body;
        done();
      });
      it("_idはmongo oid型", function (done) {
        (0, _chai.expect)(_mongoose["default"].Types.ObjectId.isValid(metaInfo._id)).equal(true);
        done();
      });
      it("tenant_idはmongo oid型", function (done) {
        (0, _chai.expect)(_mongoose["default"].Types.ObjectId.isValid(metaInfo.tenant_id)).equal(true);
        done();
      });
      it("nameは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.name.length > 0).equal(true);
        done();
      });
      it("labelは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.label.length > 0).equal(true);
        done();
      });
      it("value_typeは0文字以上の文字列", function (done) {
        (0, _chai.expect)(metaInfo.value_type.length > 0).equal(true);
        done();
      });
    });
    describe(":meta_info_idにoid以外の文字列を指定した場合", function () {
      var payload;
      var expected = {
        message: "メタ情報の取得に失敗しました",
        detail: "メタ情報IDが不正のためメタ情報の取得に失敗しました"
      };
      before(function (done) {
        request.get(meta_infos_url + "/invalid_oid").end(function (err, res) {
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
  });
  describe("post /", function () {
    describe("必要な情報にてメタ情報を作成した場合", function () {
      var payload;
      var body;
      before(function (done) {
        body = {
          metainfo: {
            tenant_id: user.tenant_id,
            name: "test",
            label: "テスト",
            value_type: "String"
          }
        };
        request.post(meta_infos_url).send(body).end(function (err, res) {
          payload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      describe("作成したメタ情報の詳細を取得した場合", function () {
        var nextPayload;
        before(function (done) {
          request.get(meta_infos_url + "/".concat(payload.body.body._id)).end(function (err, res) {
            nextPayload = res;
            done();
          });
        });
        it("http(200)が返却される", function (done) {
          (0, _chai.expect)(nextPayload.status).equal(200);
          done();
        });
        it("nameが作成した時点のものと一致する", function (done) {
          (0, _chai.expect)(nextPayload.body.body.name).equal(body.metainfo.name);
          done();
        });
        it("labelが作成した時点のものと一致する", function (done) {
          (0, _chai.expect)(nextPayload.body.body.label).equal(body.metainfo.label);
          done();
        });
        it("value_typeが作成した時点のものと一致する", function (done) {
          (0, _chai.expect)(nextPayload.body.body.value_type).equal(body.metainfo.value_type);
          done();
        });
      });
    });
    describe("nameが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "メタ情報名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              // name: "test",
              label: "テスト",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "メタ情報名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: null,
              label: "テスト",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "メタ情報名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "",
              label: "テスト",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("文字長が255を超過する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "メタ情報名が規定文字数(255)を超過したためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: _.range(257).map(function (i) {
                return "1";
              }).join(""),
              label: "テスト",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      });
      describe("重複する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定されたメタ情報名は既に登録されているためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: null,
              label: "テスト",
              value_type: "String"
            }
          };
          request.get(meta_infos_url).end(function (err, res) {
            body.metainfo.name = _.head(res.body.body).name;
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.name).equal(expected.detail);
          done();
        });
      }); // メタ情報名は禁止文字対象外

      describe.skip("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", function () {
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "メタ情報名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };
        describe("バックスラッシュ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "\\foo\\bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("スラッシュ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "/foo/bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("コロン", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: ":foo:bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("アスタリスク", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "*foo*bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("クエスチョン", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "?foo?bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧開く", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "<foo<bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧閉じる", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: ">foo>bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("パイプ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "|foo|bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
      });
    });
    describe("labelが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "表示名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "label is undefined test",
              // label: "テスト",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          console.log(_util["default"].inspect(payload.body, false, null));
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "表示名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "label is null test",
              label: null,
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "表示名が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "label is empty test",
              label: "",
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("文字長が255を超過する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "表示名が規定文字数(255)を超過したためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "label is too long test",
              label: _.range(257).map(function (i) {
                return "1";
              }).join(""),
              value_type: "String"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("重複する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "指定された表示名は既に登録されているためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "name is duplicate test",
              label: null,
              value_type: "String"
            }
          };
          request.get(meta_infos_url).end(function (err, res) {
            body.metainfo.label = _.head(res.body.body).label;
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      }); // 表示名は禁止文字の対象外

      describe.skip("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", function () {
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };
        describe("バックスラッシュ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "\\foo\\bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("スラッシュ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "/foo/bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("コロン", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: ":foo:bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("アスタリスク", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "*foo*bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("クエスチョン", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "?foo?bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧開く", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "<foo<bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("山括弧閉じる", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: ">foo>bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
        describe("パイプ", function () {
          var body;
          var payload;
          before(function (done) {
            body = {
              metainfo: {
                name: "|foo|bar",
                label: "テスト",
                value_type: "String"
              }
            };
            request.post(meta_infos_url).send(body).end(function (err, res) {
              payload = res;
              done();
            });
          });
          it("http(400)が返却される", function (done) {
            (0, _chai.expect)(payload.status).equal(400);
            done();
          });
          it("statusはfalse", function (done) {
            (0, _chai.expect)(payload.body.status).equal(false);
            done();
          });
          it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.message).equal(expected.message);
            done();
          });
          it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
            (0, _chai.expect)(payload.body.status.errors.tenant_id).equal(expected.detail);
            done();
          });
        });
      });
    });
    describe("value_typeが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "データ型が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "value_type is undefined test",
              label: "テスト" // value_type: "String"

            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.value_type).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "データ型が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "value_type is null test",
              label: "テスト",
              value_type: null
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.value_type).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "データ型が空のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "value_type is empty test",
              label: "テスト",
              value_type: ""
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.value_type).equal(expected.detail);
          done();
        });
      });
      describe("[String, Number, Date]以外の場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の登録に失敗しました",
          detail: "データ型が不正のためメタ情報の登録に失敗しました"
        };
        before(function (done) {
          body = {
            metainfo: {
              name: "value_types is not includes test",
              label: "テスト",
              value_type: "Integer"
            }
          };
          request.post(meta_infos_url).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.value_type).equal(expected.detail);
          done();
        });
      });
    });
  });
  describe("patch /:metainfo_id/label", function () {
    var metainfo;
    before(function (done) {
      request.get(meta_infos_url).end(function (err, res) {
        metainfo = _.head(res.body.body);
        done();
      });
    });
    describe("適切なmetainfo_id, labelを指定した場合", function () {
      var payload;
      var body;
      before(function (done) {
        body = _objectSpread({}, metainfo, {
          label: "changed label"
        });
        request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
          payload = res;
          done();
        });
      });
      it("http(200)が返却される", function (done) {
        (0, _chai.expect)(payload.status).equal(200);
        done();
      });
      describe("変更したmetainfoを取得すると値が反映されている", function () {
        var nextPayload;
        before(function (done) {
          request.get(meta_infos_url + "/".concat(metainfo._id)).end(function (err, res) {
            nextPayload = res;
            done();
          });
        });
        it("http(200)が返却される", function (done) {
          (0, _chai.expect)(nextPayload.status).equal(200);
          done();
        });
        it("先ほど指定したlabelが反映されている", function (done) {
          (0, _chai.expect)(nextPayload.body.body.label).equal(body.label);
          done();
        });
      });
    });
    describe("labelが", function () {
      describe("undefinedの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の表示名更新に失敗しました",
          detail: "表示名が空です"
        };
        before(function (done) {
          body = _objectSpread({}, metainfo, {
            label: undefined
          });
          request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("nullの場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の表示名更新に失敗しました",
          detail: "表示名が空です"
        };
        before(function (done) {
          body = _objectSpread({}, metainfo, {
            label: null
          });
          request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("空文字の場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の表示名更新に失敗しました",
          detail: "表示名が空です"
        };
        before(function (done) {
          body = _objectSpread({}, metainfo, {
            label: ""
          });
          request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("255文字を超過する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の表示名更新に失敗しました",
          detail: "表示名が規定文字数(255)を超過したため表示名の更新に失敗しました"
        };
        before(function (done) {
          body = _objectSpread({}, metainfo, {
            label: _.range(257).map(function (i) {
              return "1";
            }).join("")
          });
          request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe("重複する場合", function () {
        var payload;
        var body;
        var expected = {
          message: "メタ情報の表示名更新に失敗しました",
          detail: "指定された表示名は既に登録されているため表示名の更新に失敗しました"
        };
        before(function (done) {
          request.get(meta_infos_url).end(function (err, res) {
            body = _objectSpread({}, metainfo, {
              label: _.last(res.body.body).label
            });
            request.patch(meta_infos_url + "/".concat(metainfo._id, "/label")).send(body).end(function (err, res) {
              payload = res;
              done();
            });
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
        it("\u30A8\u30E9\u30FC\u6982\u8981\u306F\u300C".concat(expected.message, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.message).equal(expected.message);
          done();
        });
        it("\u30A8\u30E9\u30FC\u8A73\u7D30\u306F\u300C".concat(expected.detail, "\u300D"), function (done) {
          (0, _chai.expect)(payload.body.status.errors.label).equal(expected.detail);
          done();
        });
      });
      describe.skip("禁止文字(\\, / , :, *, ?, <, >, |)を含んでいる場合", function () {
        var expected = {
          message: "メタ情報の更新に失敗しました",
          detail: "表示名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれています"
        };
        describe("バックスラッシュ", function () {});
        describe("スラッシュ", function () {});
        describe("コロン", function () {});
        describe("アスタリスク", function () {});
        describe("クエスチョン", function () {});
        describe("山括弧開く", function () {});
        describe("山括弧閉じる", function () {});
        describe("パイプ", function () {});
      });
    });
  });
});