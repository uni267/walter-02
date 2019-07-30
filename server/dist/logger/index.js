"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _log4js = _interopRequireDefault(require("log4js"));

var constants = _interopRequireWildcard(require("../configs/constants"));

_log4js["default"].addLayout('json', function (_config) {
  return function (logEvent) {
    return JSON.stringify(logEvent.data[0]);
  };
});

_log4js["default"].configure(constants.LOGGER_CONFIG);

var mode = process.env.NODE_ENV;

var _default = _log4js["default"].getLogger(mode);

exports["default"] = _default;