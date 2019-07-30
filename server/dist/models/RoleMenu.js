"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var RoleMenuSchema = (0, _mongoose.Schema)({
  name: String,
  description: String,
  menus: Array,
  tenant_id: _mongoose.Schema.Types.ObjectId
});
RoleMenuSchema.index({
  tenant_id: 1
});

var RoleMenu = _mongoose["default"].model("role_menus", RoleMenuSchema, "role_menus");

var _default = RoleMenu;
exports["default"] = _default;