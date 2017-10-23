import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AnalysisSummarySchema = Schema({
  name: String,
  type_name: String,
  value: Number,
  created_at: { type: Date, default: Date.now },
  tenant_id: Schema.Types.ObjectId
});

const AnalysisSummary = mongoose.model(
  "analysis_summaries",
  AnalysisSummarySchema,
  "analysis_summaries"
);

export default AnalysisSummary;
