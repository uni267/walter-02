"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _server = require("../configs/server");

var _superagent = _interopRequireDefault(require("superagent"));

var mode = process.env.NODE_ENV;
var tikaUrl;

switch (mode) {
  case "integration":
    tikaUrl = "".concat(_server.TIKA_CONF.integration.host, ":").concat(_server.TIKA_CONF.integration.port);
    break;

  case "production":
    if (!process.env.TIKA_HOST_NAME) throw new Error("env.TIKA_HOST_NAME is not set");
    tikaUrl = "".concat(_server.TIKA_CONF.production.host, ":").concat(_server.TIKA_CONF.production.port);
    break;

  default:
    tikaUrl = "".concat(_server.TIKA_CONF.development.host, ":").concat(_server.TIKA_CONF.development.port);
    break;
}

var tikaClient = _superagent["default"]; //メタ情報の取得

tikaClient.getMetaInfo =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(buffer) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _superagent["default"].put(tikaUrl + "/meta").set("Accept", "application/json").send(buffer);

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}(); //テキスト情報の取得


tikaClient.getTextInfo =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(buffer) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _superagent["default"].put(tikaUrl + "/tika").send(buffer);

          case 2:
            return _context2.abrupt("return", _context2.sent);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

tikaClient.checkConnection =
/*#__PURE__*/
(0, _asyncToGenerator2["default"])(
/*#__PURE__*/
_regenerator["default"].mark(function _callee3() {
  return _regenerator["default"].wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _superagent["default"].get(tikaUrl + "/tika");

        case 2:
          return _context3.abrupt("return", _context3.sent);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3);
}));
var _default = tikaClient;
exports["default"] = _default;