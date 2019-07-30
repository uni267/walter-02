"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisUseRateTagSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  tag_id: _mongoose.Schema.Types.ObjectId,
  tag_label: String,
  used: Number,
  count: Number,
  used_total: Number,
  rate: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisUseRateTag = _mongoose["default"].model("analysis_use_rate_tags", AnalysisUseRateTagSchema, "analysis_use_rate_tags");

var _default = AnalysisUseRateTag;
exports["default"] = _default;