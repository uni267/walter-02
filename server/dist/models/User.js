"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var UserSchema = (0, _mongoose.Schema)({
  type: {
    type: String,
    "default": "user"
  },
  account_name: String,
  name: String,
  email: String,
  password: String,
  enabled: Boolean,
  deleted: Boolean,
  groups: Array,
  tenant_id: _mongoose.Schema.Types.ObjectId
});
UserSchema.index({
  tenant_id: 1
});

var User = _mongoose["default"].model("users", UserSchema, "users");

var _default = User;
exports["default"] = _default;