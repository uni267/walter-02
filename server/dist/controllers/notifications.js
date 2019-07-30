"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUnRead = exports.updateRead = exports.add = exports.view = exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _moment = _interopRequireDefault(require("moment"));

var _User = _interopRequireDefault(require("../models/User"));

var _Notification = _interopRequireDefault(require("../models/Notification"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _lodash = require("lodash");

var _logger = _interopRequireDefault(require("../logger"));

var _AppError = require("../errors/AppError");

// models
// constants
// etc
var ObjectId = _mongoose["default"].Types.ObjectId;

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_id, notifications, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            tenant_id = res.user.tenant_id;
            _context.next = 4;
            return _User["default"].aggregate([{
              $match: {
                tenant_id: tenant_id
              }
            }, {
              $lookup: {
                from: "notifications",
                localField: "_id",
                foreignField: "users",
                as: "notifications"
              }
            }, {
              $project: {
                notifications: 1
              }
            }]);

          case 4:
            notifications = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: notifications
            });
            _context.next = 14;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            errors = {};

            switch (_context.t0) {
              default:
                errors.unknown = _context.t0;
            }

            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
};

exports.index = index;

var view = function view(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var user_id, page, offset, allNotifications, readNotifications, notifications, errors;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            user_id = res.user._id;
            page = req.query.page;
            if (page === undefined || page === null || page === "") page = 0;
            offset = page * constants.INFOMATION_LIMITS_PER_PAGE;
            _context2.next = 7;
            return _User["default"].aggregate([{
              $match: {
                _id: ObjectId(user_id)
              }
            }, {
              $lookup: {
                from: "notifications",
                localField: "_id",
                foreignField: "users",
                as: "notifications"
              }
            }, {
              $project: {
                notifications: 1,
                _id: 0
              }
            }, {
              $unwind: {
                path: "$notifications"
              }
            }]);

          case 7:
            allNotifications = _context2.sent;
            readNotifications = allNotifications.filter(function (notification) {
              return notification.notifications.read === undefined || notification.notifications.read === false;
            });
            _context2.next = 11;
            return _User["default"].aggregate([{
              $match: {
                _id: ObjectId(user_id)
              }
            }, {
              $lookup: {
                from: "notifications",
                localField: "_id",
                foreignField: "users",
                as: "notifications"
              }
            }, {
              $project: {
                notifications: 1,
                _id: 0
              }
            }, {
              $unwind: {
                path: "$notifications"
              }
            }, {
              $sort: {
                "notifications._id": -1
              }
            }, {
              '$skip': offset
            }, {
              '$limit': constants.INFOMATION_LIMITS_PER_PAGE
            }]);

          case 11:
            notifications = _context2.sent;
            res.json({
              status: {
                success: true,
                unread: readNotifications.length,
                total: allNotifications.length,
                page: page
              },
              body: notifications
            });
            _context2.next = 21;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](0);
            errors = {};

            switch (_context2.t0) {
              default:
                errors.unknown = _context2.t0;
            }

            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 15]]);
  }));
};

exports.view = view;

var add = function add(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var _req$body$notificatio, title, body, users, modified, user_ids, user, notifications, errors;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!(req.body.notifications === undefined)) {
              _context3.next = 3;
              break;
            }

            throw new _AppError.ValidationError("notifications is empty");

          case 3:
            _req$body$notificatio = req.body.notifications, title = _req$body$notificatio.title, body = _req$body$notificatio.body, users = _req$body$notificatio.users;

            if (!(title === undefined || title === null || title === "")) {
              _context3.next = 6;
              break;
            }

            throw new _AppError.ValidationError("title is empty");

          case 6:
            if (!(body === undefined || body === null || body === "")) {
              _context3.next = 8;
              break;
            }

            throw new _AppError.ValidationError("body is empty");

          case 8:
            if (!(users === undefined || users === null || (0, _lodash.isEmpty)(users))) {
              _context3.next = 10;
              break;
            }

            throw new _AppError.ValidationError("users is empty");

          case 10:
            modified = (0, _moment["default"])().format("YYYY-MM-DD HH:mm:ss");
            user_ids = users.map(function (user_id) {
              return ObjectId(user_id);
            });
            _context3.next = 14;
            return _User["default"].find({
              _id: {
                $in: user_ids
              }
            });

          case 14:
            user = _context3.sent;

            if (!(0, _lodash.isEmpty)(user)) {
              _context3.next = 17;
              break;
            }

            throw new _AppError.RecordNotFoundException("user is not find");

          case 17:
            _context3.next = 19;
            return user.map(function (user) {
              var notification = new _Notification["default"]();
              notification.title = title;
              notification.body = body;
              notification.modified = modified;
              notification.read = false;
              notification.users = user;
              return notification.save();
            });

          case 19:
            notifications = _context3.sent;
            res.json({
              status: {
                success: true
              },
              body: notifications
            });
            _context3.next = 42;
            break;

          case 23:
            _context3.prev = 23;
            _context3.t0 = _context3["catch"](0);
            errors = {};
            _context3.t1 = _context3.t0.message;
            _context3.next = _context3.t1 === "notifications is empty" ? 29 : _context3.t1 === "title is empty" ? 31 : _context3.t1 === "body is empty" ? 33 : _context3.t1 === "users is empty" ? 35 : _context3.t1 === "user is not find" ? 37 : 39;
            break;

          case 29:
            errors.notifications = "お知らせが空のためお知らせの登録に失敗しました";
            return _context3.abrupt("break", 40);

          case 31:
            errors.title = "タイトルが空です";
            return _context3.abrupt("break", 40);

          case 33:
            errors.body = "本文が空です";
            return _context3.abrupt("break", 40);

          case 35:
            errors.users = "ユーザーが空です";
            return _context3.abrupt("break", 40);

          case 37:
            errors.user = "指定されたユーザーが存在しないためお知らせの登録に失敗しました";
            return _context3.abrupt("break", 40);

          case 39:
            errors.unknown = _context3.t0;

          case 40:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "お知らせの登録に失敗しました",
                errors: errors
              }
            });

          case 42:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 23]]);
  }));
};

exports.add = add;

var updateRead = function updateRead(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4() {
    var user_id, notifications, notificationIds, updateResult, allNotifications, readNotifications, errors;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            user_id = res.user._id;
            notifications = req.body.notifications;
            notificationIds = notifications.map(function (notificationId) {
              return ObjectId(notificationId);
            });
            _context4.next = 6;
            return _Notification["default"].update({
              _id: {
                $in: notificationIds
              }
            }, {
              $set: {
                read: true
              }
            }, {
              multi: true
            });

          case 6:
            updateResult = _context4.sent;
            _context4.next = 9;
            return _Notification["default"].find({
              users: ObjectId(user_id)
            });

          case 9:
            allNotifications = _context4.sent;
            readNotifications = allNotifications.filter(function (notification) {
              return notification.read === undefined || notification.read === false;
            });
            res.json({
              status: {
                success: true,
                unread: readNotifications.length,
                total: allNotifications.length
              },
              body: updateResult
            });
            _context4.next = 20;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](0);
            errors = {};

            switch (_context4.t0.message) {
              default:
                errors.unknown = _context4.t0;
            }

            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 20:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 14]]);
  }));
};

exports.updateRead = updateRead;

var updateUnRead = function updateUnRead(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    var user_id, notifications, notificationIds, updateResult, allNotifications, readNotifications, errors;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            user_id = res.user._id;
            notifications = req.body.notifications;
            notificationIds = notifications.map(function (notificationId) {
              return ObjectId(notificationId);
            });
            _context5.next = 6;
            return _Notification["default"].update({
              _id: {
                $in: notificationIds
              }
            }, {
              $set: {
                read: false
              }
            }, {
              multi: true
            });

          case 6:
            updateResult = _context5.sent;
            _context5.next = 9;
            return _Notification["default"].find({
              users: ObjectId(user_id)
            });

          case 9:
            allNotifications = _context5.sent;
            readNotifications = allNotifications.filter(function (notification) {
              return notification.read === undefined || notification.read === false;
            });
            res.json({
              status: {
                success: true,
                unread: readNotifications.length,
                total: allNotifications.length
              },
              body: updateResult
            });
            _context5.next = 20;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            errors = {};

            switch (_context5.t0.message) {
              default:
                errors.unknown = _context5.t0;
            }

            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 20:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 14]]);
  }));
};

exports.updateUnRead = updateUnRead;