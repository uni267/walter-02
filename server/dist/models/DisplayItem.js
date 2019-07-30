"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var DisplayItemSchema = (0, _mongoose.Schema)({
  tenant_id: _mongoose.Schema.Types.ObjectId,
  meta_info_id: _mongoose.Schema.Types.ObjectId,
  label: String,
  name: String,
  value_type: String,
  is_display: Boolean,
  is_excel: Boolean,
  is_search: Boolean,
  search_value_type: String,
  between: Boolean,
  width: String,
  order: Number,
  default_sort: _mongoose.Schema.Types.Mixed,
  select_options: _mongoose.Schema.Types.Mixed
});
DisplayItemSchema.index({
  tenant_id: 1
});
DisplayItemSchema.index({
  meta_info_id: 1
});

var DisplayItem = _mongoose["default"].model("display_items", DisplayItemSchema, "display_items");

var _default = DisplayItem;
exports["default"] = _default;