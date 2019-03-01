import mongoose, { Schema } from "mongoose";

// models
import File from "./File";
import MetaInfo from "./MetaInfo";

mongoose.Promise = global.Promise;

const FileMetaInfoSchema = Schema({
  file_id: Schema.Types.ObjectId,
  meta_info_id: Schema.Types.ObjectId,
  value: String,
  timestamps: Array,
});

FileMetaInfoSchema.index({ file_id: 1 });
FileMetaInfoSchema.index({ meta_info_id: 1 });

const FileMetaInfo = mongoose.model(
  "file_meta_infos",
  FileMetaInfoSchema,
  "file_meta_infos"
);

export default FileMetaInfo;
