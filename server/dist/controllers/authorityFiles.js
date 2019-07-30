"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.files = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _logger = _interopRequireDefault(require("../logger"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _AuthorityFile = _interopRequireDefault(require("../models/AuthorityFile"));

var _RoleFile = _interopRequireDefault(require("../models/RoleFile"));

var _Action = _interopRequireDefault(require("../models/Action"));

var _AppError = require("../errors/AppError");

var files = function files(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var user_id, _files, condition, actions, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            user_id = res.user._id;

            if (!(req.body.files === undefined)) {
              _context.next = 4;
              break;
            }

            throw new _AppError.ValidationError("files is undefined");

          case 4:
            _files = req.body.files.filter(function (id) {
              return _mongoose["default"].Types.ObjectId.isValid(id);
            }).map(function (id) {
              return _mongoose["default"].Types.ObjectId(id);
            });
            condition = {
              users: _mongoose["default"].Types.ObjectId(user_id),
              files: {
                $in: _files
              }
            };
            _context.next = 8;
            return _AuthorityFile["default"].getActions(condition);

          case 8:
            actions = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: actions
            });
            _context.next = 24;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            _logger["default"].error(_context.t0);

            errors = {};
            _context.t1 = _context.t0.message;
            _context.next = _context.t1 === "files is undefined" ? 19 : 21;
            break;

          case 19:
            errors.files = "ファイルIDが空のためファイル権限の取得に失敗しました";
            return _context.abrupt("break", 22);

          case 21:
            errors.unknown = _context.t0;

          case 22:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイル権限の取得に失敗しました",
                errors: errors
              }
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));
};

exports.files = files;