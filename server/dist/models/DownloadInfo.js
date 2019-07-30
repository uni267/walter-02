"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var DownloadInfoSchema = (0, _mongoose.Schema)({
  tenant_id: _mongoose.Schema.Types.ObjectId,
  type: String,
  // file,excel
  value: String,
  // "{bbbbbbbbb}_{aaaaaaa:YYYYMMDD}{extension}"
  extensionTarget: _mongoose.Schema.Types.ObjectId
});

var DownloadInfo = _mongoose["default"].model("download_infos", DownloadInfoSchema);

var _default = DownloadInfo;
exports["default"] = _default;