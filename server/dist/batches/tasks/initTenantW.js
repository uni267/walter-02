"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _co = _interopRequireDefault(require("co"));

var _mongoose = require("mongoose");

var _moment = _interopRequireDefault(require("moment"));

var _util = _interopRequireDefault(require("util"));

var _ = _interopRequireWildcard(require("lodash"));

var _logger = _interopRequireDefault(require("../../logger"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _Dir = _interopRequireDefault(require("../../models/Dir"));

var _File = _interopRequireDefault(require("../../models/File"));

var _Group = _interopRequireDefault(require("../../models/Group"));

var _User = _interopRequireDefault(require("../../models/User"));

var _Action = _interopRequireDefault(require("../../models/Action"));

var _Menu = _interopRequireDefault(require("../../models/Menu"));

var _RoleFile = _interopRequireDefault(require("../../models/RoleFile"));

var _RoleMenu = _interopRequireDefault(require("../../models/RoleMenu"));

var _AuthorityMenu = _interopRequireDefault(require("../../models/AuthorityMenu"));

var _AuthorityFile = _interopRequireDefault(require("../../models/AuthorityFile"));

var _Preview = _interopRequireDefault(require("../../models/Preview"));

var _AppSetting = _interopRequireDefault(require("../../models/AppSetting"));

var _DownloadInfo = _interopRequireDefault(require("../../models/DownloadInfo"));

var _Tag = _interopRequireDefault(require("../../models/Tag"));

var _DisplayItem = _interopRequireDefault(require("../../models/DisplayItem"));

var _MetaInfo = _interopRequireDefault(require("../../models/MetaInfo"));

// logger
// models
var task =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6() {
    var tenantName, tenant, group_norm, group_admin, existing_rolemenu_ids, roleMenu_norm, roleMenu_admin, existing_rolefile_ids, role_file_full_controll, role_file_read_only, existing_user_ids, pass, user_admin, tags, existing_file_ids;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            console.log('addTenantバッチにより追加されたテナントに対し、カスタマイズします。');

            if (process.argv[3]) {
              _context6.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            //テナント名をfindしてなければアウト
            tenantName = process.argv[3];
            _context6.next = 7;
            return _Tenant["default"].findOne({
              name: tenantName
            });

          case 7:
            tenant = _context6.sent;

            if (tenant) {
              _context6.next = 10;
              break;
            }

            throw new Error("存在しないテナントです");

          case 10:
            console.log("\u30C6\u30CA\u30F3\u30C8 ".concat(tenant.name, "(").concat(tenant._id, ") \u306E\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u307E\u3059\u3002"));
            console.log('start'); // ===============================
            //  テナント毎のグローバル設定(app_settings)
            // ===============================

            _context6.next = 14;
            return _AppSetting["default"].remove({
              tenant_id: tenant._id
            });

          case 14:
            _context6.next = 16;
            return _AppSetting["default"].insertMany([{
              tenant_id: tenant._id,
              // ファイル一覧の設定項目
              name: "unvisible_files_toggle",
              description: "非表示属性のファイルを表示/非表示するトグルを表示するか",
              enable: false,
              default_value: false
            }, {
              tenant_id: tenant._id,
              name: "change_user_password_permission",
              description: "ユーザにパスワード変更の権限を許可するか",
              enable: true,
              default_value: false // 許可しない

            }, {
              tenant_id: tenant._id,
              name: "inherit_parent_dir_auth",
              description: "アップロード時に親フォルダの割り当てられたユーザファイル操作権限を継承する",
              enable: true,
              default_value: false // 許可しない

            }, {
              tenant_id: tenant._id,
              name: "show_trash_icon_by_own_auth",
              description: "ごみ箱アイコンの表示をTrashフォルダの権限に負う",
              enable: true,
              default_value: false // 許可しない

            }]);

          case 16:
            _context6.next = 18;
            return _Group["default"].update({
              name: "全社",
              tenant_id: tenant._id
            }, {
              $set: {
                name: '一般ユーザG'
              }
            }, {
              multi: false
            });

          case 18:
            _context6.next = 20;
            return _Group["default"].update({
              name: "管理者",
              tenant_id: tenant._id
            }, {
              $set: {
                name: '管理者G'
              }
            }, {
              multi: false
            });

          case 20:
            _context6.next = 22;
            return _Group["default"].findOne({
              name: '一般ユーザG'
            });

          case 22:
            group_norm = _context6.sent;
            _context6.next = 25;
            return _Group["default"].findOne({
              name: '管理者G'
            });

          case 25:
            group_admin = _context6.sent;
            _context6.next = 28;
            return _RoleMenu["default"].find({
              tenant_id: tenant._id
            });

          case 28:
            _context6.t0 = function (rolemenu) {
              return rolemenu._id.toString();
            };

            existing_rolemenu_ids = _context6.sent.map(_context6.t0);
            _context6.next = 32;
            return Promise.all(_.forEach(existing_rolemenu_ids,
            /*#__PURE__*/
            function () {
              var _ref2 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee(id) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _AuthorityMenu["default"].remove({
                          role_menus: _mongoose.Types.ObjectId(id)
                        });

                      case 2:
                        _context.next = 4;
                        return _RoleMenu["default"].remove({
                          _id: _mongoose.Types.ObjectId(id)
                        });

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 32:
            // RoleMenuの追加
            roleMenu_norm = new _RoleMenu["default"]();
            roleMenu_norm.name = "一般";
            roleMenu_norm.description = "";
            _context6.next = 37;
            return _Menu["default"].findOne({
              name: "home"
            });

          case 37:
            _context6.t1 = _context6.sent._id;
            roleMenu_norm.menus = [_context6.t1];
            roleMenu_norm.tenant_id = tenant._id;
            _context6.next = 42;
            return roleMenu_norm.save();

          case 42:
            roleMenu_admin = new _RoleMenu["default"]();
            roleMenu_admin.name = "システム管理";
            roleMenu_admin.description = "";
            _context6.next = 47;
            return _Menu["default"].findOne({
              name: "home"
            });

          case 47:
            _context6.t2 = _context6.sent._id;
            _context6.next = 50;
            return _Menu["default"].findOne({
              name: "tags"
            });

          case 50:
            _context6.t3 = _context6.sent._id;
            _context6.next = 53;
            return _Menu["default"].findOne({
              name: "users"
            });

          case 53:
            _context6.t4 = _context6.sent._id;
            roleMenu_admin.menus = [_context6.t2, _context6.t3, _context6.t4];
            roleMenu_admin.tenant_id = tenant._id;
            _context6.next = 58;
            return roleMenu_admin.save();

          case 58:
            _context6.next = 60;
            return _RoleFile["default"].find({
              tenant_id: tenant._id
            });

          case 60:
            _context6.t5 = function (rolefile) {
              return rolefile._id.toString();
            };

            existing_rolefile_ids = _context6.sent.map(_context6.t5);
            _context6.next = 64;
            return Promise.all(_.forEach(existing_rolefile_ids,
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee2(id) {
                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return _AuthorityFile["default"].remove({
                          role_files: _mongoose.Types.ObjectId(id)
                        });

                      case 2:
                        _context2.next = 4;
                        return _RoleFile["default"].remove({
                          _id: _mongoose.Types.ObjectId(id)
                        });

                      case 4:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2);
              }));

              return function (_x2) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 64:
            _context6.t6 = _RoleFile["default"];
            _context6.next = 67;
            return _Action["default"].findOne({
              name: "list"
            });

          case 67:
            _context6.t7 = _context6.sent._id;
            _context6.next = 70;
            return _Action["default"].findOne({
              name: "detail"
            });

          case 70:
            _context6.t8 = _context6.sent._id;
            _context6.next = 73;
            return _Action["default"].findOne({
              name: "download"
            });

          case 73:
            _context6.t9 = _context6.sent._id;
            _context6.t10 = [_context6.t7, _context6.t8, _context6.t9];
            _context6.t11 = tenant._id;
            _context6.t12 = {
              name: "読み取りのみ",
              description: "",
              actions: _context6.t10,
              tenant_id: _context6.t11
            };
            _context6.next = 79;
            return _Action["default"].findOne({
              name: "list"
            });

          case 79:
            _context6.t13 = _context6.sent._id;
            _context6.next = 82;
            return _Action["default"].findOne({
              name: "detail"
            });

          case 82:
            _context6.t14 = _context6.sent._id;
            _context6.next = 85;
            return _Action["default"].findOne({
              name: "download"
            });

          case 85:
            _context6.t15 = _context6.sent._id;
            _context6.next = 88;
            return _Action["default"].findOne({
              name: "change-name"
            });

          case 88:
            _context6.t16 = _context6.sent._id;
            _context6.next = 91;
            return _Action["default"].findOne({
              name: "change-tag"
            });

          case 91:
            _context6.t17 = _context6.sent._id;
            _context6.next = 94;
            return _Action["default"].findOne({
              name: "upload"
            });

          case 94:
            _context6.t18 = _context6.sent._id;
            _context6.next = 97;
            return _Action["default"].findOne({
              name: "makedir"
            });

          case 97:
            _context6.t19 = _context6.sent._id;
            _context6.next = 100;
            return _Action["default"].findOne({
              name: "move"
            });

          case 100:
            _context6.t20 = _context6.sent._id;
            _context6.next = 103;
            return _Action["default"].findOne({
              name: "restore"
            });

          case 103:
            _context6.t21 = _context6.sent._id;
            _context6.next = 106;
            return _Action["default"].findOne({
              name: "delete"
            });

          case 106:
            _context6.t22 = _context6.sent._id;
            _context6.next = 109;
            return _Action["default"].findOne({
              name: "dir-authority"
            });

          case 109:
            _context6.t23 = _context6.sent._id;
            _context6.t24 = [_context6.t13, _context6.t14, _context6.t15, _context6.t16, _context6.t17, _context6.t18, _context6.t19, _context6.t20, _context6.t21, _context6.t22, _context6.t23];
            _context6.t25 = tenant._id;
            _context6.t26 = {
              name: "フルコントロール",
              description: "読み取り + 書き込み + 権限変更",
              actions: _context6.t24,
              tenant_id: _context6.t25
            };
            _context6.t27 = [_context6.t12, _context6.t26];
            _context6.next = 116;
            return _context6.t6.insertMany.call(_context6.t6, _context6.t27);

          case 116:
            _context6.next = 118;
            return _RoleFile["default"].findOne({
              name: "フルコントロール",
              tenant_id: tenant._id
            });

          case 118:
            role_file_full_controll = _context6.sent;
            _context6.next = 121;
            return _RoleFile["default"].findOne({
              name: "読み取りのみ",
              tenant_id: tenant._id
            });

          case 121:
            role_file_read_only = _context6.sent;
            _context6.next = 124;
            return _AuthorityFile["default"].insertMany([{
              files: tenant.home_dir_id,
              role_files: role_file_full_controll._id,
              users: null,
              groups: group_admin._id
            }, {
              files: tenant.home_dir_id,
              role_files: role_file_read_only._id,
              users: null,
              groups: group_norm._id
            }, {
              files: tenant.trash_dir_id,
              role_files: role_file_full_controll._id,
              users: null,
              groups: group_admin._id
            }]);

          case 124:
            _context6.next = 126;
            return _User["default"].find({
              tenant_id: tenant._id
            });

          case 126:
            _context6.t28 = function (user) {
              return user._id.toString();
            };

            existing_user_ids = _context6.sent.map(_context6.t28);
            _context6.next = 130;
            return Promise.all(_.forEach(existing_user_ids,
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee3(id) {
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _AuthorityMenu["default"].remove({
                          users: _mongoose.Types.ObjectId(id)
                        });

                      case 2:
                        _context3.next = 4;
                        return _User["default"].remove({
                          _id: _mongoose.Types.ObjectId(id)
                        });

                      case 4:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x3) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 130:
            //初期ユーザー作成
            pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";
            user_admin = new _User["default"]();
            user_admin.type = "user";
            user_admin.account_name = "wakayama";
            user_admin.name = "システム管理者";
            user_admin.email = "".concat(user_admin.account_name, "@").concat(tenantName);
            user_admin.password = pass;
            user_admin.enabled = true;
            _context6.next = 140;
            return _Group["default"].findOne({
              name: "管理者G",
              tenant_id: tenant._id
            }, {
              _id: 1
            });

          case 140:
            _context6.t29 = _context6.sent._id;
            user_admin.groups = [_context6.t29];
            user_admin.tenant_id = tenant._id;
            _context6.next = 145;
            return user_admin.save();

          case 145:
            _context6.next = 147;
            return _AuthorityMenu["default"].insertMany([{
              role_menus: roleMenu_admin._id,
              users: user_admin._id,
              groups: null
            }]);

          case 147:
            _context6.next = 149;
            return _Tag["default"].remove({
              tenant_id: tenant._id
            });

          case 149:
            //テナントid一致分を全てクリア
            tags = [{
              color: "#f44336",
              label: "分析種 経済分析"
            }, {
              color: "#e91e63",
              label: "分析種 社会分析"
            }, {
              color: "#9c27b0",
              label: "分析種 その他"
            }, {
              color: "#673ab7",
              label: "分野 暮らし"
            }, {
              color: "#3f51b5",
              label: "分野 環境"
            }, {
              color: "#2196f3",
              label: "分野 農林業"
            }, {
              color: "#03a9f4",
              label: "分野 漁業"
            }, {
              color: "#00bcd4",
              label: "分野 産業"
            }, {
              color: "#009688",
              label: "分野 観光"
            }, {
              color: "#4caf50",
              label: "分野 移住定住"
            }, {
              color: "#8bc34a",
              label: "分野 健康・医療"
            }, {
              color: "#cddc39",
              label: "分野 福祉"
            }, {
              color: "#ffeb3b",
              label: "分野 教育"
            }, {
              color: "#ffc107",
              label: "分野 文化"
            }, {
              color: "#ff9800",
              label: "分野 まちづくり"
            }, {
              color: "#ff5722",
              label: "分野 交通"
            }, {
              color: "#795548",
              label: "分野 防災"
            }, {
              color: "#607d8b",
              label: "分野 その他"
            }];
            _context6.next = 152;
            return Promise.all(_.map(tags,
            /*#__PURE__*/
            function () {
              var _ref5 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee4(tag) {
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return _Tag["default"].insertMany([{
                          color: tag.color,
                          label: tag.label,
                          tenant_id: tenant._id
                        }]);

                      case 2:
                        return _context4.abrupt("return", _context4.sent);

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x4) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 152:
            _context6.next = 154;
            return _Dir["default"].find({
              ancestor: tenant.home_dir_id,
              depth: 1,
              descendant: {
                '$ne': tenant.trash_dir_id
              }
            });

          case 154:
            _context6.t30 = function (dir) {
              return dir.descendant.toString();
            };

            existing_file_ids = _context6.sent.map(_context6.t30);
            _context6.next = 158;
            return Promise.all(_.map(existing_file_ids,
            /*#__PURE__*/
            function () {
              var _ref6 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee5(id) {
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _File["default"].remove({
                          _id: _mongoose.Types.ObjectId(id)
                        });

                      case 2:
                        _context5.next = 4;
                        return _AuthorityFile["default"].remove({
                          files: _mongoose.Types.ObjectId(id)
                        });

                      case 4:
                        _context5.next = 6;
                        return _Dir["default"].remove({
                          descendant: _mongoose.Types.ObjectId(id)
                        });

                      case 6:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 158:
            _context6.next = 166;
            break;

          case 160:
            _context6.prev = 160;
            _context6.t31 = _context6["catch"](0);
            console.log(_context6.t31);
            console.log(_util["default"].inspect(_context6.t31, false, null));

            _logger["default"].error(_context6.t31);

            process.exit();

          case 166:
            _context6.prev = 166;
            console.log('end');

            _logger["default"].info("################# init wak tenant end #################");

            process.exit();
            return _context6.finish(166);

          case 171:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 160, 166, 171]]);
  }));

  return function task() {
    return _ref.apply(this, arguments);
  };
}();

var _default = task;
exports["default"] = _default;