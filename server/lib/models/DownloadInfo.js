import mongoose, { Schema } from "mongoose";

mongoose.Promise = global.Promise;

const DownloadInfoSchema = Schema({
  tenant_id: Schema.Types.ObjectId,
  type: String, // file,excel
  value: String // "{bbbbbbbbb}_{aaaaaaa:YYYYMMDD}{extension}"
});

const DownloadInfo = mongoose.model("download_infos", DownloadInfoSchema);

export default DownloadInfo;