"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _User = _interopRequireDefault(require("./User"));

var History = {
  user: _User["default"],
  action: String,
  body: String
};
var _default = History;
exports["default"] = _default;