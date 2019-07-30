"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var GroupSchema = (0, _mongoose.Schema)({
  name: String,
  description: String,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  roles: Array
});
GroupSchema.index({
  tenant_id: 1
});

var Group = _mongoose["default"].model("groups", GroupSchema, "groups");

var _default = Group;
exports["default"] = _default;