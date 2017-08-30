import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const GroupSchema = Schema({
  name: String,
  roles: Array
});

const Group = mongoose.model("groups", GroupSchema, "groups");

export default Group;
