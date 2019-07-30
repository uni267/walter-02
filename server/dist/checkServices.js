"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkKafka = exports.checkTika = exports.checkElastic = exports.checkSwift = exports.checkMongo = exports.getApiPort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _server = require("./configs/server");

var _routes = _interopRequireDefault(require("./routes"));

var constants = _interopRequireWildcard(require("./configs/constants"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Swift = require("./storages/Swift");

var _elasticsearchclient = _interopRequireDefault(require("./elasticsearchclient"));

var _tikaclient = _interopRequireDefault(require("./tikaclient"));

var _logger = _interopRequireDefault(require("./logger"));

var _kafkaclient = require("./kafkaclient");

// mongoのipなど
// 環境変数
// 開発 => development、社内テスト => integration、本番 => production
var mode = process.env.NODE_ENV;
var url;
var db_name;
var port;

switch (mode) {
  case "integration":
    url = _server.SERVER_CONF.integration.url;
    db_name = _server.SERVER_CONF.integration.db_name;
    port = _server.SERVER_CONF.integration.port;
    break;

  case "production":
    if (!process.env.MONGO_HOST_NAME) throw new Error("env.MONGO_HOST_NAME is not set");
    url = _server.SERVER_CONF.production.url;
    db_name = _server.SERVER_CONF.production.db_name;
    port = _server.SERVER_CONF.production.port;
    break;

  default:
    url = _server.SERVER_CONF.development.url;
    db_name = _server.SERVER_CONF.development.db_name;
    port = _server.SERVER_CONF.development.port;
    break;
}

var getApiPort = function getApiPort() {
  return port;
};

exports.getApiPort = getApiPort;
_mongoose["default"].Promise = global.Promise;

var checkMongo = function checkMongo(checked) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  _mongoose["default"].connect("".concat(url, "/").concat(db_name), {
    useNewUrlParser: true
  }).then(function (res) {
    checked();
  })["catch"](function (e) {
    console.log("mongo connection failed", count + 1);

    _logger["default"].info("mongo connection failed", count + 1);

    setTimeout(function () {
      if (constants.MONGO_CONNECTION_RETRY <= count) throw new Error("mongodb connection failed");
      checkMongo(checked, count + 1);
    }, constants.MONGO_CONNECTION_INTERVAL);
  });
};

exports.checkMongo = checkMongo;

var checkSwift = function checkSwift(checked) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var swift = new _Swift.Swift();
  swift.getContainers().then(function (res) {
    checked();
  })["catch"](function (e) {
    console.log(e);
    console.log("swift connection failed", count + 1);

    _logger["default"].info("swift connection failed", count + 1);

    if (constants.SWIFT_CONNECTION_RETRY <= count) throw new Error("swift connection failed");
    setTimeout(function () {
      checkSwift(checked, count + 1);
    }, constants.SWIFT_CONNECTION_INTERVAL);
  });
};

exports.checkSwift = checkSwift;

var checkElastic = function checkElastic(checked) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  _elasticsearchclient["default"].ping({}, {
    requestTimeout: constants.ELASTIC_CONNECTION_TIMEOUT
  }, function (err) {
    if (err) {
      console.log("elasticsearch connection failed", count + 1);

      _logger["default"].info("elasticsearch connection failed", count + 1);

      if (constants.ELASTIC_CONNECTION_RETRY <= count) throw new Error("elasticsearch connection failed");
      setTimeout(function () {
        checkElastic(checked, count + 1);
      }, constants.ELASTIC_CONNECTION_INTERVAL);
    } else {
      checked();
    }
  });
};

exports.checkElastic = checkElastic;

var checkTika =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(checked) {
    var count,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            count = _args.length > 1 && _args[1] !== undefined ? _args[1] : 0;
            _context.prev = 1;
            //await tikaClient.checkConnection()
            checked();
            _context.next = 12;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](1);
            console.log("tika connection failed", count + 1);

            _logger["default"].info("tika connection failed", count + 1);

            if (!(constants.TIKA_CONNECTION_RETRY <= count)) {
              _context.next = 11;
              break;
            }

            throw new Error("tika connection failed");

          case 11:
            setTimeout(function () {
              checkTika(checked, count + 1);
            }, constants.TIKA_CONNECTION_INTERVAL);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 5]]);
  }));

  return function checkTika(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.checkTika = checkTika;

var checkKafka =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(checked) {
    var count,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            count = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
            _context2.prev = 1;
            //await createTopics([
            //  {
            //    topic: constants.KAFKA_TOPIC_TIKA_NAME,
            //    partitions: constants.KAFKA_TOPIC_TIKA_PARTITIONS,
            //    replicationFactor: constants.KAFKA_TOPIC_TIKA_REPLICATION_FACTOR
            //  },
            //])
            checked();
            _context2.next = 13;
            break;

          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);
            console.log("kafka connection failed", count + 1);

            _logger["default"].info("kafka connection failed", count + 1);

            if (!(constants.KAFKA_CONNECTION_RETRY <= count)) {
              _context2.next = 12;
              break;
            }

            throw new Error("kafka connection failed");

          case 12:
            setTimeout(function () {
              checkKafka(checked, count + 1);
            }, constants.KAFKA_CONNECTION_INTERVAL);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 5]]);
  }));

  return function checkKafka(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.checkKafka = checkKafka;