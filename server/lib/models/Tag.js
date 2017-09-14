import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const TagSchema = Schema({
  color: String,
  label: String,
  description: String
});

const Tag = mongoose.model("tags", TagSchema, "tags");
export default Tag;
