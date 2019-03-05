"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

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
  created_at: { type: Date, default: Date.now }
});

var AnalysisUseRateUser = _mongoose2.default.model("analysis_use_rate_users", AnalysisUseRateUserSchema, "analysis_use_rate_users");

exports.default = AnalysisUseRateUser;