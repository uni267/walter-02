"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _supertest = require("supertest");

var _supertest2 = _interopRequireDefault(_supertest);

var _superagentDefaults = require("superagent-defaults");

var _superagentDefaults2 = _interopRequireDefault(_superagentDefaults);

var _routes = require("../../routes");

var _routes2 = _interopRequireDefault(_routes);

var _Tenant = require("../../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _File = require("../../models/File");

var _File2 = _interopRequireDefault(_File);

var _Tag = require("../../models/Tag");

var _Tag2 = _interopRequireDefault(_Tag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// router
var app = (0, _express2.default)();

// models

app.use(_bodyParser2.default.json());
app.use("/", _routes2.default);

var request = (0, _superagentDefaults2.default)((0, _supertest2.default)(app));

var task = function task() {
  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var tenant_name, tenant, targetTag, targetFiles, authData, authRes, _authRes$body$body, user, token;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _logger2.default.info("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始");
            // console.log("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始");

            if (process.argv[3]) {
              _context.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            tenant_name = process.argv[3];
            _context.next = 7;
            return _Tenant2.default.findOne({ name: tenant_name });

          case 7:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 10;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 " + tenant_name);

          case 10:
            _context.next = 12;
            return _Tag2.default.findOne({
              label: "非表示",
              tenant_id: tenant._id
            });

          case 12:
            targetTag = _context.sent;
            _context.next = 15;
            return _File2.default.find({
              tags: targetTag._id,
              unvisible: false
            });

          case 15:
            targetFiles = _context.sent;


            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u6570: " + targetFiles.length);
            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9: " + targetFiles);

            _logger2.default.info("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u6570: " + targetFiles.length);
            _logger2.default.info("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9: " + targetFiles);

            authData = void 0;

            if (!(process.env.NODE_ENV === "production")) {
              _context.next = 29;
              break;
            }

            if (process.argv[4]) {
              _context.next = 24;
              break;
            }

            throw new Error("引数にログイン名が必要");

          case 24:
            if (process.argv[5]) {
              _context.next = 26;
              break;
            }

            throw new Error("引数にログイン名が必要");

          case 26:

            authData = {
              account_name: process.argv[4],
              password: process.argv[5],
              tenant_name: tenant.name
            };

            _context.next = 30;
            break;

          case 29:
            authData = {
              account_name: "taro",
              password: "test",
              tenant_name: tenant_name
            };

          case 30:
            _context.next = 32;
            return new Promise(function (resolve, reject) {
              request.post("/api/login").send(authData).end(function (err, res) {
                if (err) reject(err);
                resolve(res);
              });
            });

          case 32:
            authRes = _context.sent;
            _authRes$body$body = authRes.body.body, user = _authRes$body$body.user, token = _authRes$body$body.token;

            if (user) {
              _context.next = 36;
              break;
            }

            throw new Error("ログイン時のユーザ情報取得に失敗");

          case 36:
            if (token) {
              _context.next = 38;
              break;
            }

            throw new Error("ログイントークンの取得に失敗");

          case 38:

            request.set("x-auth-cloud-storage", token);

            // 非表示状態トグルのapiをコール
            _context.next = 41;
            return targetFiles.map(function (file) {
              return new Promise(function (resolve, reject) {
                request.patch("/api/v1/files/" + file._id + "/toggle_unvisible").end(function (err, res) {
                  if (err) reject(err);
                  resolve(res);
                });
              });
            });

          case 41:

            _logger2.default.info("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");
            console.log("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");
            process.exit();
            _context.next = 51;
            break;

          case 46:
            _context.prev = 46;
            _context.t0 = _context["catch"](0);

            _logger2.default.error(_context.t0);
            console.log(_context.t0);
            process.exit();

          case 51:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 46]]);
  }));
};

exports.default = task;