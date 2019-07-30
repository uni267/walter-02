"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var TagSchema = (0, _mongoose.Schema)({
  color: String,
  label: String,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  order: {
    type: Number,
    "default": 0
  }
});
TagSchema.index({
  tenant_id: 1
});

var Tag = _mongoose["default"].model("tags", TagSchema, "tags");

var _default = Tag;
exports["default"] = _default;