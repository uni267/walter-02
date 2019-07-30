"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisUseRateMimeTypeSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  mime_type: String,
  used: Number,
  used_total: Number,
  count: Number,
  count_total: Number,
  rate: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisUseRateMimeType = _mongoose["default"].model("analysis_use_rate_mimetypes", AnalysisUseRateMimeTypeSchema, "analysis_use_rate_mimetypes");

var _default = AnalysisUseRateMimeType;
exports["default"] = _default;