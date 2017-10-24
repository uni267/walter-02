import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const AuthoritySchema = Schema({
  files : Schema.Types.ObjectId,
  roles : { type:Schema.Types.ObjectId, ref:'roles'},
  users : { type:Schema.Types.ObjectId, ref:'users'},
  groups : { type:Schema.Types.ObjectId, ref:'groups'}
});

const Authority = mongoose.model("authorities", AuthoritySchema, "authorities");

export default Authority;
