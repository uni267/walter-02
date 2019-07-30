"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _logger = _interopRequireDefault(require("../../logger"));

var _User = _interopRequireDefault(require("../../models/User"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _RoleMenu = _interopRequireDefault(require("../../models/RoleMenu"));

var _AuthorityMenu = _interopRequireDefault(require("../../models/AuthorityMenu"));

// logger
// models
var task = function task() {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_name, tenant, admin_user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("################# delete admin start #################");
            tenant_name = process.argv[3];

            if (!(tenant_name === undefined)) {
              _context.next = 5;
              break;
            }

            throw "テナントを指定してください";

          case 5:
            console.log("tenant name: " + tenant_name);
            _context.next = 8;
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 8:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 11;
              break;
            }

            throw "指定されたテナントが見つかりません";

          case 11:
            _context.next = 13;
            return _User["default"].findOne({
              account_name: "admin"
            });

          case 13:
            admin_user = _context.sent;

            if (!(admin_user === null)) {
              _context.next = 16;
              break;
            }

            throw "管理者は存在しません";

          case 16:
            _context.next = 18;
            return _RoleMenu["default"].remove({
              name: "システム管理者"
            });

          case 18:
            _context.next = 20;
            return _AuthorityMenu["default"].remove({
              users: admin_user
            });

          case 20:
            _context.next = 22;
            return _User["default"].remove({
              account_name: "admin"
            });

          case 22:
            console.log("システム管理者を削除しました");
            console.log("################# delete admin end #################");
            _context.next = 30;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](0);

            _logger["default"].error(_context.t0);

            console.log(_context.t0);

          case 30:
            _context.prev = 30;
            process.exit();
            return _context.finish(30);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 26, 30, 33]]);
  }));
};

var _default = task;
exports["default"] = _default;