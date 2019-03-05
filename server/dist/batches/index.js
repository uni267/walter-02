"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _index = require("./tasks/index");

var tasks = _interopRequireWildcard(_index);

var _server = require("../configs/server");

var _constants = require("../configs/constants");

var constants = _interopRequireWildcard(_constants);

var _logger = require("../logger");

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
var mode = process.env.NODE_ENV;

var url = void 0;
var db_name = void 0;

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

_mongoose2.default.connect(url + "/" + db_name, { useMongoClient: true }).then(function () {
  var args = process.argv[2];
  switch (args) {
    case "analyze":
      tasks.AnalyzeTask();
      break;
    case "perfTest":
      tasks.PerfTest();
      break;
    case "addTenant":
      tasks.addTenantTask();
      break;
    case "initTenantW":
      tasks.initTenantWTask();
      break;
    case "reCreateElasticCache":
      tasks.reCreateElasticCacheTask();
      break;
    case "initElasticsearch":
      tasks.initElasticsearchTask();
      break;
    case "moveUnvisibleFiles":
      tasks.moveInvisibleFilesTask();
      break;
    case "createAdmin":
      tasks.createAdminTask();
      break;
      break;
    case "deleteAdmin":
      tasks.deleteAdminTask();
      break;
    default:
      throw new Error("引数が不正です。");
  }
}).catch(function (err) {

  _logger2.default.info(err);
  process.exit();
});