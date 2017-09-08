import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const RoleSchema = Schema({
  name: String,
  description: String,
  actions: Array,
  tenant_id: Schema.Types.ObjectId
});

const Role = mongoose.model("roles", RoleSchema, "roles");

export default Role;
