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

var _Group = _interopRequireDefault(require("../../models/Group"));

var _AuthorityMenu = _interopRequireDefault(require("../../models/AuthorityMenu"));

var _Menu = _interopRequireDefault(require("../../models/Menu"));

// logger
// models
var task = function task() {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var tenant_name, tenant, _admin_user, admin_user, pass, menu, role, authority_menus, _ref, createdUser, createdAuthorityMenu;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("################# create admin start #################");
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
            return _User["default"].find({
              account_name: "admin",
              tenant_id: tenant._id
            }).count();

          case 13:
            _admin_user = _context.sent;

            if (!(_admin_user > 0)) {
              _context.next = 16;
              break;
            }

            throw "すでにシステム管理者は存在します";

          case 16:
            admin_user = new _User["default"]();
            pass = "c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec";
            admin_user.type = "user";
            admin_user.account_name = "admin";
            admin_user.name = "admin";
            admin_user.email = "admin";
            admin_user.password = pass;
            admin_user.enabled = true;
            admin_user.tenant_id = tenant._id;
            _context.next = 27;
            return _Group["default"].findOne({
              name: "全社"
            }, {
              _id: 1
            });

          case 27:
            _context.t0 = _context.sent._id;
            admin_user.groups = [_context.t0];
            _context.next = 31;
            return _Menu["default"].find({}, {
              _id: 1
            });

          case 31:
            _context.t1 = function (m) {
              return m._id;
            };

            menu = _context.sent.map(_context.t1);
            role = new _RoleMenu["default"]();
            role.name = "システム管理者";
            role.description = "";
            role.menus = menu;
            role.tenant_id = tenant._id;
            _context.next = 40;
            return role.save();

          case 40:
            authority_menus = new _AuthorityMenu["default"]();
            authority_menus.role_menus = role._id;
            authority_menus.users = admin_user;
            authority_menus.groups = null;
            _context.next = 46;
            return {
              createdUser: admin_user.save(),
              createdAuthorityMenu: authority_menus.save()
            };

          case 46:
            _ref = _context.sent;
            createdUser = _ref.createdUser;
            createdAuthorityMenu = _ref.createdAuthorityMenu;
            console.log("システム管理者を作成しました");
            console.log("################# create admin end #################");
            _context.next = 57;
            break;

          case 53:
            _context.prev = 53;
            _context.t2 = _context["catch"](0);

            _logger["default"].error(_context.t2);

            console.log(_context.t2);

          case 57:
            _context.prev = 57;
            process.exit();
            return _context.finish(57);

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 53, 57, 60]]);
  }));
};

var _default = task;
exports["default"] = _default;