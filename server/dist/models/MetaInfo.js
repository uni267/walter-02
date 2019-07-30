"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var MetaInfoSchema = (0, _mongoose.Schema)({
  tenant_id: _mongoose.Schema.Types.ObjectId,
  label: String,
  name: String,
  value_type: String
});
MetaInfoSchema.index({
  tenant_id: 1
});

var MetaInfo = _mongoose["default"].model("meta_infos", MetaInfoSchema, "meta_infos");

var _default = MetaInfo;
exports["default"] = _default;