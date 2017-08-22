import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const FileSchema = Schema({
  name: String,
  modified: { type: Date, default: Date.now },
  is_dir: Boolean,
  dir_id: Schema.Types.ObjectId,
  is_display: Boolean,
  is_star: Boolean,
  tags: Array,
  histories: Array,
  authorities: Array,
  metaInfo: Array
});

const File = mongoose.model("files", FileSchema, "files");

export default File;
