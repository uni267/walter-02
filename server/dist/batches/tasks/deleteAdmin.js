"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _Tenant = require("../../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _RoleMenu = require("../../models/RoleMenu");

var _RoleMenu2 = _interopRequireDefault(_RoleMenu);

var _AuthorityMenu = require("../../models/AuthorityMenu");

var _AuthorityMenu2 = _interopRequireDefault(_AuthorityMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// models
var task = function task() {
	(0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
		var tenant_name, tenant, admin_user;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;

						_logger2.default.info("################# delete admin start #################");
						tenant_name = process.argv[3];

						if (!(tenant_name === undefined)) {
							_context.next = 5;
							break;
						}

						throw "テナントを指定してください";

					case 5:

						_logger2.default.info("tenant name: " + tenant_name);

						_context.next = 8;
						return _Tenant2.default.findOne({ name: tenant_name });

					case 8:
						tenant = _context.sent;

						if (!(tenant === null)) {
							_context.next = 11;
							break;
						}

						throw "指定されたテナントが見つかりません";

					case 11:
						_context.next = 13;
						return _User2.default.findOne({ account_name: "admin" });

					case 13:
						admin_user = _context.sent;

						if (!(admin_user === null)) {
							_context.next = 16;
							break;
						}

						throw "管理者は存在しません";

					case 16:
						_context.next = 18;
						return _RoleMenu2.default.remove({ name: "システム管理者" });

					case 18:
						_context.next = 20;
						return _AuthorityMenu2.default.remove({ users: admin_user });

					case 20:
						_context.next = 22;
						return _User2.default.remove({ account_name: "admin" });

					case 22:

						console.log("システム管理者を削除しました");
						_logger2.default.info("################# delete admin end #################");

						_context.next = 30;
						break;

					case 26:
						_context.prev = 26;
						_context.t0 = _context["catch"](0);

						_logger2.default.error(_context.t0);
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
		}, _callee, this, [[0, 26, 30, 33]]);
	}));
};

// logger
exports.default = task;