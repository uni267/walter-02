"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var TenantSchema = (0, _mongoose.Schema)({
  name: String,
  home_dir_id: _mongoose.Schema.Types.ObjectId,
  trash_dir_id: _mongoose.Schema.Types.ObjectId,
  threshold: _mongoose.Schema.Types.Number,
  tsaAuth: _mongoose.Schema.Types.Mixed // { user, pass }

});
TenantSchema.index({
  home_dir_id: 1
});
TenantSchema.index({
  trash_dir_id: 1
});

var Tenant = _mongoose["default"].model("tenants", TenantSchema, "tenants");

var _default = Tenant;
exports["default"] = _default;