"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var MenuSchema = (0, _mongoose.Schema)({
  label: _mongoose.Schema.Types.String,
  name: _mongoose.Schema.Types.String
});

var Menu = _mongoose["default"].model("menus", MenuSchema, "menus");

var _default = Menu;
exports["default"] = _default;