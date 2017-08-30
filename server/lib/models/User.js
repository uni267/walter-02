import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const UserSchema = Schema({
  type: String,
  name: String,
  email: String,
  password: String,
  enabled: Boolean,
  groups: Array,
  tenant_id: Schema.Types.ObjectId
});

const User = mongoose.model("users", UserSchema, "users");

export default User;
