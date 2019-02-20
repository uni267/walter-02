import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const GroupSchema = Schema({
  name: String,
  description: String,
  tenant_id: Schema.Types.ObjectId,
  roles: Array
});

GroupSchema.index({ tenant_id: 1 });

const Group = mongoose.model("groups", GroupSchema, "groups");

export default Group;
