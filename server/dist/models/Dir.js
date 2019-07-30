"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var DirSchema = (0, _mongoose.Schema)({
  ancestor: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'files'
  }],
  descendant: _mongoose.Schema.Types.ObjectId,
  depth: Number
});
DirSchema.index({
  ancestor: 1
});
DirSchema.index({
  descendant: 1
});

var Dir = _mongoose["default"].model("dirs", DirSchema, "dirs");

var _default = Dir;
exports["default"] = _default;