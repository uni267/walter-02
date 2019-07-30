"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _File = _interopRequireDefault(require("./File"));

var _MetaInfo = _interopRequireDefault(require("./MetaInfo"));

// models
_mongoose["default"].Promise = global.Promise;
var FileMetaInfoSchema = (0, _mongoose.Schema)({
  file_id: _mongoose.Schema.Types.ObjectId,
  meta_info_id: _mongoose.Schema.Types.ObjectId,
  value: _mongoose.Schema.Types.Mixed
});
FileMetaInfoSchema.index({
  file_id: 1
});
FileMetaInfoSchema.index({
  meta_info_id: 1
});

var FileMetaInfo = _mongoose["default"].model("file_meta_infos", FileMetaInfoSchema, "file_meta_infos");

var _default = FileMetaInfo;
exports["default"] = _default;