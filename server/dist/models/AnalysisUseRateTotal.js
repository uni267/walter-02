"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisUseRateTotalSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  threshold: Number,
  used: Number,
  free: Number,
  used_rate: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisUseRateTotal = _mongoose["default"].model("analysis_use_rate_totals", AnalysisUseRateTotalSchema, "analysis_use_rate_totals");

var _default = AnalysisUseRateTotal;
exports["default"] = _default;