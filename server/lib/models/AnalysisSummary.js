import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AnalysisSummarySchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  name: String,
  label: String,
  value: Number,
  created_at: { type: Date, default: Date.now }
});

const AnalysisSummary = mongoose.model(
  "analysis_summaries",
  AnalysisSummarySchema,
  "analysis_summaries"
);

export default AnalysisSummary;
