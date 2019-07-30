"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisFolderCountSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  count: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisFolderCount = _mongoose["default"].model("analysis_folder_counts", AnalysisFolderCountSchema, "analysis_folder_counts");

var _default = AnalysisFolderCount;
exports["default"] = _default;