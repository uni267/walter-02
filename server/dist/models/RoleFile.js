"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var RoleFileSchema = (0, _mongoose.Schema)({
  name: String,
  description: String,
  actions: Array,
  tenant_id: _mongoose.Schema.Types.ObjectId
});
RoleFileSchema.index({
  tenant_id: 1
});

var RoleFile = _mongoose["default"].model("role_files", RoleFileSchema, "role_files");

var _default = RoleFile;
exports["default"] = _default;