import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const TagSchema = Schema({
  color: String,
  label: String,
  tenant_id: Schema.Types.ObjectId,
  order: { type: Number, default: 0 },
});

const Tag = mongoose.model("tags", TagSchema, "tags");
export default Tag;
