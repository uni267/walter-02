"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var ActionSchema = (0, _mongoose.Schema)({
  label: _mongoose.Schema.Types.String,
  name: _mongoose.Schema.Types.String
});

var Action = _mongoose["default"].model("actions", ActionSchema, "actions");

var _default = Action;
exports["default"] = _default;