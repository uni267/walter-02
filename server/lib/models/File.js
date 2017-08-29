import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const FileSchema = Schema({
  name: String,
  blob_path: String,
  mime_type: String,
  size: Number,
  modified: { type: Date, default: Date.now },
  is_dir: Boolean,
  dir_id: Schema.Types.ObjectId,
  is_display: Boolean,
  is_star: Boolean,
  tags: Array,
  histories: Array,
  authorities: Array,
  meta_infos: Array
});

const File = mongoose.model("files", FileSchema, "files");

export default File;
