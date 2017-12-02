import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AnalysysUseRateUserSchema = Schema({
  reported_at: Number,
  tenant_id: Schema.Types.ObjectId,
  name: String,
  label: String,
  user_id: Schema.Types.ObjectId,
  account_name: String,
  user_name: String,
  used: Number,
  used_total: Number,
  rate: Number,
  created_at: { type: Date, default: Date.now }
});

const AnalysysUseRateUser = mongoose.model(
  "analysis_use_rate_users",
  AnalysysUseRateUserSchema,
  "analysis_use_rate_users"
);

export default AnalysysUseRateUser;
