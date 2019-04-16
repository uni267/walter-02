import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const MetaInfoSchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  label: String,
  name: String,
  value_type: String
});

MetaInfoSchema.index({ tenant_id: 1 });

const MetaInfo = mongoose.model("meta_infos", MetaInfoSchema, "meta_infos");

export default MetaInfo;
