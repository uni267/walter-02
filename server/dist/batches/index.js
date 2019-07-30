"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var tasks = _interopRequireWildcard(require("./tasks/index"));

var _server = require("../configs/server");

var constants = _interopRequireWildcard(require("../configs/constants"));

var _logger = _interopRequireDefault(require("../logger"));

var _addTenant = _interopRequireDefault(require("./tasks/addTenant"));

var _initTenantW = _interopRequireDefault(require("./tasks/initTenantW"));

var _initElasticsearch = _interopRequireWildcard(require("./tasks/initElasticsearch"));

var _addTimestampSetting = _interopRequireDefault(require("./tasks/addTimestampSetting"));

var _initDatabase = _interopRequireDefault(require("./tasks/initDatabase"));

// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
var mode = process.env.NODE_ENV;
var url;
var db_name;

switch (mode) {
  case "integration":
    url = _server.SERVER_CONF.integration.url;
    db_name = _server.SERVER_CONF.integration.db_name;
    break;

  case "production":
    url = _server.SERVER_CONF.production.url;
    db_name = _server.SERVER_CONF.production.db_name;
    break;

  default:
    url = _server.SERVER_CONF.development.url;
    db_name = _server.SERVER_CONF.development.db_name;
    break;
}

_mongoose["default"].connect("".concat(url, "/").concat(db_name), {
  useNewUrlParser: true
}).then(
/*#__PURE__*/
(0, _asyncToGenerator2["default"])(
/*#__PURE__*/
_regenerator["default"].mark(function _callee() {
  var args;
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          args = process.argv[2];
          _context.t0 = args;
          _context.next = _context.t0 === "analyze" ? 4 : _context.t0 === "perfTest" ? 7 : _context.t0 === "addTenant" ? 10 : _context.t0 === "initTenantW" ? 13 : _context.t0 === "addTimestampSetting" ? 16 : _context.t0 === "reCreateElasticCache" ? 19 : _context.t0 === "initElasticsearch" ? 22 : _context.t0 === "moveUnvisibleFiles" ? 25 : _context.t0 === "createAdmin" ? 28 : _context.t0 === "deleteAdmin" ? 31 : _context.t0 === "initDb" ? 34 : 37;
          break;

        case 4:
          _context.next = 6;
          return tasks.AnalyzeTask();

        case 6:
          return _context.abrupt("break", 38);

        case 7:
          _context.next = 9;
          return tasks.PerfTest();

        case 9:
          return _context.abrupt("break", 38);

        case 10:
          _context.next = 12;
          return (0, _addTenant["default"])(process.argv[3]);

        case 12:
          return _context.abrupt("break", 38);

        case 13:
          _context.next = 15;
          return (0, _initTenantW["default"])(process.argv[3]);

        case 15:
          return _context.abrupt("break", 38);

        case 16:
          _context.next = 18;
          return (0, _addTimestampSetting["default"])(process.argv[3], process.argv[4], process.argv[5]);

        case 18:
          return _context.abrupt("break", 38);

        case 19:
          _context.next = 21;
          return (0, _initElasticsearch.reCreateElasticCache)(process.argv[3]);

        case 21:
          return _context.abrupt("break", 38);

        case 22:
          _context.next = 24;
          return (0, _initElasticsearch["default"])(process.argv[3]);

        case 24:
          return _context.abrupt("break", 38);

        case 25:
          _context.next = 27;
          return tasks.moveInvisibleFilesTask();

        case 27:
          return _context.abrupt("break", 38);

        case 28:
          _context.next = 30;
          return tasks.createAdminTask();

        case 30:
          return _context.abrupt("break", 38);

        case 31:
          _context.next = 33;
          return tasks.deleteAdminTask();

        case 33:
          return _context.abrupt("break", 38);

        case 34:
          _context.next = 36;
          return (0, _initDatabase["default"])();

        case 36:
          return _context.abrupt("break", 38);

        case 37:
          throw new Error("引数が不正です。");

        case 38:
          process.exit();

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})))["catch"](function (e) {
  _logger["default"].error(e);

  process.exit();
});