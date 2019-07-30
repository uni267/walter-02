"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _util = _interopRequireDefault(require("util"));

var _co = _interopRequireDefault(require("co"));

var _logger = _interopRequireDefault(require("../../logger"));

var _supertest = _interopRequireDefault(require("supertest"));

var _superagentDefaults = _interopRequireDefault(require("superagent-defaults"));

var _routes = _interopRequireDefault(require("../../routes"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _File = _interopRequireDefault(require("../../models/File"));

var _Tag = _interopRequireDefault(require("../../models/Tag"));

// router
// models
var app = (0, _express["default"])();
app.use(_bodyParser["default"].json());
app.use("/", _routes["default"]);
var request = (0, _superagentDefaults["default"])((0, _supertest["default"])(app));

var task = function task() {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_name, tenant, targetTag, targetFiles, authData, authRes, _authRes$body$body, user, token;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始"); // console.log("非表示タグのついたファイルを非表示属性に変更するパッチを適用開始");

            if (process.argv[3]) {
              _context.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            tenant_name = process.argv[3];
            _context.next = 7;
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 7:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 10;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 ".concat(tenant_name));

          case 10:
            _context.next = 12;
            return _Tag["default"].findOne({
              label: "非表示",
              tenant_id: tenant._id
            });

          case 12:
            targetTag = _context.sent;
            _context.next = 15;
            return _File["default"].find({
              tags: targetTag._id,
              unvisible: false
            });

          case 15:
            targetFiles = _context.sent;
            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u6570: ".concat(targetFiles.length));
            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9: ".concat(targetFiles));
            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9\u6570: ".concat(targetFiles.length));
            console.log("\u975E\u8868\u793A\u30D1\u30C3\u30C1\u9069\u7528\u5BFE\u8C61\u306E\u30EC\u30B3\u30FC\u30C9: ".concat(targetFiles));

            if (!(process.env.NODE_ENV === "production")) {
              _context.next = 28;
              break;
            }

            if (process.argv[4]) {
              _context.next = 23;
              break;
            }

            throw new Error("引数にログイン名が必要");

          case 23:
            if (process.argv[5]) {
              _context.next = 25;
              break;
            }

            throw new Error("引数にログイン名が必要");

          case 25:
            authData = {
              account_name: process.argv[4],
              password: process.argv[5],
              tenant_name: tenant.name
            };
            _context.next = 29;
            break;

          case 28:
            authData = {
              account_name: "taro",
              password: "test",
              tenant_name: tenant_name
            };

          case 29:
            _context.next = 31;
            return new Promise(function (resolve, reject) {
              request.post("/api/login").send(authData).end(function (err, res) {
                if (err) reject(err);
                resolve(res);
              });
            });

          case 31:
            authRes = _context.sent;
            _authRes$body$body = authRes.body.body, user = _authRes$body$body.user, token = _authRes$body$body.token;

            if (user) {
              _context.next = 35;
              break;
            }

            throw new Error("ログイン時のユーザ情報取得に失敗");

          case 35:
            if (token) {
              _context.next = 37;
              break;
            }

            throw new Error("ログイントークンの取得に失敗");

          case 37:
            request.set("x-auth-cloud-storage", token); // 非表示状態トグルのapiをコール

            _context.next = 40;
            return targetFiles.map(function (file) {
              return new Promise(function (resolve, reject) {
                request.patch("/api/v1/files/".concat(file._id, "/toggle_unvisible")).end(function (err, res) {
                  if (err) reject(err);
                  resolve(res);
                });
              });
            });

          case 40:
            console.log("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");
            console.log("非表示タグのついたファイルを非表示属性に変更するパッチが適用完了");
            process.exit();
            _context.next = 50;
            break;

          case 45:
            _context.prev = 45;
            _context.t0 = _context["catch"](0);

            _logger["default"].error(_context.t0);

            console.log(_context.t0);
            process.exit();

          case 50:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 45]]);
  }));
};

var _default = task;
exports["default"] = _default;