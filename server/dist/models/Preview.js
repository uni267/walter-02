"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var PreviewSchema = (0, _mongoose.Schema)({
  image: Object,
  creating: {
    type: Boolean,
    "default": false
  }
});

var Preview = _mongoose["default"].model("previews", PreviewSchema, "previews");

var _default = Preview;
exports["default"] = _default;