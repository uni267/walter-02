"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var NotificationSchema = (0, _mongoose.Schema)({
  users: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  read: Boolean,
  title: String,
  body: String,
  create: {
    type: Date,
    "default": Date.now
  },
  modified: {
    type: Date,
    "default": Date.now
  }
});
NotificationSchema.index({
  users: 1
});

var Notification = _mongoose["default"].model("notifications", NotificationSchema, "notifications");

var _default = Notification;
exports["default"] = _default;