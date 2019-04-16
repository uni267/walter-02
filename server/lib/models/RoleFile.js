import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const RoleFileSchema = Schema({
  name: String,
  description: String,
  actions: Array,
  tenant_id: Schema.Types.ObjectId
});

RoleFileSchema.index({ tenant_id: 1 });

const RoleFile = mongoose.model("role_files", RoleFileSchema, "role_files");

export default RoleFile;
