"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

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
  default_sort: _mongoose.Schema.Types.Mixed
});

DisplayItemSchema.index({ tenant_id: 1 });
DisplayItemSchema.index({ meta_info_id: 1 });

var DisplayItem = _mongoose2.default.model("display_items", DisplayItemSchema, "display_items");

exports.default = DisplayItem;