"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisUseRateFolderSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  dir_name: String,
  used: Number,
  used_total: Number,
  rate: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisUseRateFolder = _mongoose["default"].model("analysis_use_rate_folders", AnalysisUseRateFolderSchema, "analysis_use_rate_folders");

var _default = AnalysisUseRateFolder;
exports["default"] = _default;