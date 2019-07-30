"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var AnalysisUseRateUserSchema = (0, _mongoose.Schema)({
  reported_at: Number,
  tenant_id: _mongoose.Schema.Types.ObjectId,
  name: String,
  label: String,
  user_id: _mongoose.Schema.Types.ObjectId,
  account_name: String,
  user_name: String,
  used: Number,
  used_total: Number,
  rate: Number,
  created_at: {
    type: Date,
    "default": Date.now
  }
});

var AnalysisUseRateUser = _mongoose["default"].model("analysis_use_rate_users", AnalysisUseRateUserSchema, "analysis_use_rate_users");

var _default = AnalysisUseRateUser;
exports["default"] = _default;