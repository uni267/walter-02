"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _AuthorityMenu = _interopRequireDefault(require("../models/AuthorityMenu"));

var _User = _interopRequireDefault(require("../models/User"));

var ObjectId = _mongoose["default"].Types.ObjectId;

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var user_id, user, condition, menus, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            user_id = res.user._id;
            _context.next = 4;
            return _User["default"].findById(user_id);

          case 4:
            user = _context.sent;
            condition = {
              $or: [{
                users: ObjectId(user_id)
              }, {
                groups: {
                  $in: user.groups
                }
              }]
            };
            _context.next = 8;
            return _AuthorityMenu["default"].getMenus(condition);

          case 8:
            menus = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: menus
            });
            _context.next = 17;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            errors = {};
            errors = _context.t0;
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));
};

exports.index = index;