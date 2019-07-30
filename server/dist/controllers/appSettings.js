"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_id, tenant, settings;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            tenant_id = res.user.tenant_id;
            _context.next = 4;
            return _Tenant["default"].findById(tenant_id);

          case 4:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 7;
              break;
            }

            throw new Error("指定されたテナントが存在しないため設定の取得に失敗しました");

          case 7:
            _context.next = 9;
            return _AppSetting["default"].find({
              tenant_id: tenant._id
            });

          case 9:
            settings = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: settings
            });
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            res.status(400).json({
              status: {
                success: false
              }
            });

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
};

exports.index = index;