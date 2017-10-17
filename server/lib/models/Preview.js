import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const PreviewSchema = Schema({
  image: Object
});

const Preview = mongoose.model("previews", PreviewSchema, "previews");

export default Preview;
