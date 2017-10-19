import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AuthoritySchema = Schema({
  // files : [{ type:Schema.Types.ObjectId, ref:'files'}],
  roles : [{ type:Schema.Types.ObjectId, ref:'roles'}],
  users : [{ type:Schema.Types.ObjectId, ref:'users'}],
  groups : [{ type:Schema.Types.ObjectId, ref:'groups'}]
});

const Authority = mongoose.model("authorities", AuthoritySchema, "authorities");

export default Authority;
