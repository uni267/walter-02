"use strict";

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

var _initElasticsearch = _interopRequireDefault(require("./initElasticsearch"));

// logger
// models
var task =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenant_name) {
    var _tenant, now, root_files, topDir, trashDir, dirs, tenant, group1, group2, pass, user1, user2, roleMenu1, roleMenu2, role_file_full_controll, role_file_read_only, display_file_name_id, send_date_time_id;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("add tenant '".concat(tenant_name, "' start....."));

            if (tenant_name) {
              _context.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            _context.next = 6;
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 6:
            _tenant = _context.sent;

            if (!_tenant) {
              _context.next = 9;
              break;
            }

            throw new Error("すでに存在しているテナントです");

          case 9:
            now = new Date();
            root_files = [{
              name: "Top",
              modified: now,
              is_dir: true,
              //dir_id: 0.0,
              is_display: false,
              authority_files: []
            }, {
              name: "Trash",
              modified: now,
              is_dir: true,
              //dir_id: 0.0,
              is_display: false,
              authority_files: []
            }];
            _context.next = 13;
            return _File["default"].insertMany(root_files);

          case 13:
            _context.next = 15;
            return _File["default"].findOne({
              name: 'Top',
              modified: {
                "$gte": now
              }
            });

          case 15:
            topDir = _context.sent;
            _context.next = 18;
            return _File["default"].findOne({
              name: 'Trash',
              modified: {
                "$gte": now
              }
            });

          case 18:
            trashDir = _context.sent;
            //console.log(topDir)
            //console.log(trashDir)
            //dirコレクション
            dirs = [{
              ancestor: topDir._id,
              descendant: topDir._id,
              depth: 0
            }, {
              ancestor: trashDir._id,
              descendant: trashDir._id,
              depth: 0
            }, {
              ancestor: topDir._id,
              descendant: trashDir._id,
              depth: 1
            }];
            _context.next = 22;
            return _Dir["default"].insertMany(dirs);

          case 22:
            // ===============================
            //  tenants collection
            // ===============================
            tenant = new _Tenant["default"]();
            tenant.name = tenant_name;
            tenant.home_dir_id = topDir._id;
            tenant.trash_dir_id = trashDir._id;
            tenant.threshold = 1024 * 1024 * 1024 * 100;
            _context.next = 29;
            return tenant.save();

          case 29:
            // ===============================
            // groups collection
            // ===============================
            group1 = new _Group["default"]();
            group1.name = "全社";
            group1.description = "全社員が所属するグループ";
            group1.role_files = [];
            group1.tenant_id = tenant._id;
            _context.next = 36;
            return group1.save();

          case 36:
            group2 = new _Group["default"]();
            group2.name = "管理者";
            group2.description = "システム管理者";
            group2.role_files = [];
            group2.tenant_id = tenant._id;
            _context.next = 43;
            return group2.save();

          case 43:
            // ===============================
            //  users collection
            // ===============================
            pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";
            user1 = new _User["default"]();
            user1.type = "user";
            user1.account_name = tenant_name + '2';
            user1.name = user1.account_name;
            user1.email = user1.account_name + '@' + tenant_name;
            user1.password = pass;
            user1.enabled = true;
            _context.next = 53;
            return _Group["default"].findOne({
              name: "全社",
              tenant_id: tenant._id
            }, {
              _id: 1
            });

          case 53:
            _context.t0 = _context.sent._id;
            user1.groups = [_context.t0];
            user1.tenant_id = tenant._id;
            _context.next = 58;
            return user1.save();

          case 58:
            console.log("\u4E00\u822C\u30E6\u30FC\u30B6\u30FC ".concat(user1.account_name, "\u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F"));
            user2 = new _User["default"]();
            user2.type = "user";
            user2.account_name = tenant_name + '1';
            user2.name = user2.account_name;
            user2.email = user2.account_name + '@' + tenant_name;
            user2.password = pass;
            user2.enabled = true;
            _context.next = 68;
            return _Group["default"].findOne({
              name: "全社",
              tenant_id: tenant._id
            }, {
              _id: 1
            });

          case 68:
            _context.t1 = _context.sent._id;
            _context.next = 71;
            return _Group["default"].findOne({
              name: "管理者",
              tenant_id: tenant._id
            }, {
              _id: 1
            });

          case 71:
            _context.t2 = _context.sent._id;
            user2.groups = [_context.t1, _context.t2];
            user2.tenant_id = tenant._id;
            _context.next = 76;
            return user2.save();

          case 76:
            console.log("\u7BA1\u7406\u30E6\u30FC\u30B6\u30FC ".concat(user2.account_name, "\u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F")); // ===============================
            //  tags collection
            // ===============================

            _context.next = 79;
            return _Tag["default"].insertMany([{
              color: "#f55",
              label: "非表示",
              tenant_id: tenant._id
            }]);

          case 79:
            _context.next = 81;
            return _DisplayItem["default"].insertMany([{
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "",
              name: "file_checkbox",
              search_value_type: null,
              is_display: true,
              is_excel: false,
              is_search: false,
              width: "5%",
              order: 10
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "ファイル名",
              name: "name",
              search_value_type: "String",
              is_display: true,
              is_excel: true,
              is_search: true,
              width: "50%",
              order: 20
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "更新日時",
              name: "modified",
              search_value_type: "Date",
              value_type: "Date",
              is_display: true,
              is_excel: true,
              is_search: true,
              between: true,
              width: "20%",
              order: 30,
              default_sort: {
                desc: true
              }
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "メンバー",
              name: "authorities",
              search_value_type: "Select",
              value_type: "Select",
              is_display: true,
              is_excel: true,
              is_search: false,
              width: "15%",
              order: 40
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "操作",
              name: "action",
              search_value_type: null,
              is_display: true,
              is_excel: false,
              is_search: false,
              width: "10%",
              order: 50
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "お気に入り",
              name: "favorite",
              search_value_type: "Bool",
              value_type: "Bool",
              is_display: false,
              is_excel: false,
              is_search: false,
              order: 130
            }, {
              tenant_id: tenant._id,
              meta_info_id: null,
              label: "タグ",
              name: "tag",
              search_value_type: "Select",
              value_type: "MultiSelect",
              is_display: false,
              is_excel: true,
              is_search: true,
              order: 140
            }]);

          case 81:
            _context.t3 = _RoleFile["default"];
            _context.next = 84;
            return _Action["default"].findOne({
              name: "list"
            });

          case 84:
            _context.t4 = _context.sent._id;
            _context.next = 87;
            return _Action["default"].findOne({
              name: "detail"
            });

          case 87:
            _context.t5 = _context.sent._id;
            _context.next = 90;
            return _Action["default"].findOne({
              name: "history"
            });

          case 90:
            _context.t6 = _context.sent._id;
            _context.next = 93;
            return _Action["default"].findOne({
              name: "download"
            });

          case 93:
            _context.t7 = _context.sent._id;
            _context.t8 = [_context.t4, _context.t5, _context.t6, _context.t7];
            _context.t9 = tenant._id;
            _context.t10 = {
              name: "読み取りのみ",
              description: "",
              actions: _context.t8,
              tenant_id: _context.t9
            };
            _context.next = 99;
            return _Action["default"].findOne({
              name: "list"
            });

          case 99:
            _context.t11 = _context.sent._id;
            _context.next = 102;
            return _Action["default"].findOne({
              name: "detail"
            });

          case 102:
            _context.t12 = _context.sent._id;
            _context.next = 105;
            return _Action["default"].findOne({
              name: "history"
            });

          case 105:
            _context.t13 = _context.sent._id;
            _context.next = 108;
            return _Action["default"].findOne({
              name: "download"
            });

          case 108:
            _context.t14 = _context.sent._id;
            _context.next = 111;
            return _Action["default"].findOne({
              name: "change-name"
            });

          case 111:
            _context.t15 = _context.sent._id;
            _context.next = 114;
            return _Action["default"].findOne({
              name: "change-tag"
            });

          case 114:
            _context.t16 = _context.sent._id;
            _context.next = 117;
            return _Action["default"].findOne({
              name: "upload"
            });

          case 117:
            _context.t17 = _context.sent._id;
            _context.next = 120;
            return _Action["default"].findOne({
              name: "makedir"
            });

          case 120:
            _context.t18 = _context.sent._id;
            _context.next = 123;
            return _Action["default"].findOne({
              name: "copy"
            });

          case 123:
            _context.t19 = _context.sent._id;
            _context.next = 126;
            return _Action["default"].findOne({
              name: "restore"
            });

          case 126:
            _context.t20 = _context.sent._id;
            _context.next = 129;
            return _Action["default"].findOne({
              name: "delete"
            });

          case 129:
            _context.t21 = _context.sent._id;
            _context.t22 = [_context.t11, _context.t12, _context.t13, _context.t14, _context.t15, _context.t16, _context.t17, _context.t18, _context.t19, _context.t20, _context.t21];
            _context.t23 = tenant._id;
            _context.t24 = {
              name: "編集可能",
              description: "読み取り + 書き込み",
              actions: _context.t22,
              tenant_id: _context.t23
            };
            _context.next = 135;
            return _Action["default"].findOne({
              name: "list"
            });

          case 135:
            _context.t25 = _context.sent._id;
            _context.next = 138;
            return _Action["default"].findOne({
              name: "detail"
            });

          case 138:
            _context.t26 = _context.sent._id;
            _context.next = 141;
            return _Action["default"].findOne({
              name: "history"
            });

          case 141:
            _context.t27 = _context.sent._id;
            _context.next = 144;
            return _Action["default"].findOne({
              name: "download"
            });

          case 144:
            _context.t28 = _context.sent._id;
            _context.next = 147;
            return _Action["default"].findOne({
              name: "change-name"
            });

          case 147:
            _context.t29 = _context.sent._id;
            _context.next = 150;
            return _Action["default"].findOne({
              name: "change-tag"
            });

          case 150:
            _context.t30 = _context.sent._id;
            _context.next = 153;
            return _Action["default"].findOne({
              name: "upload"
            });

          case 153:
            _context.t31 = _context.sent._id;
            _context.next = 156;
            return _Action["default"].findOne({
              name: "makedir"
            });

          case 156:
            _context.t32 = _context.sent._id;
            _context.next = 159;
            return _Action["default"].findOne({
              name: "copy"
            });

          case 159:
            _context.t33 = _context.sent._id;
            _context.next = 162;
            return _Action["default"].findOne({
              name: "restore"
            });

          case 162:
            _context.t34 = _context.sent._id;
            _context.next = 165;
            return _Action["default"].findOne({
              name: "delete"
            });

          case 165:
            _context.t35 = _context.sent._id;
            _context.next = 168;
            return _Action["default"].findOne({
              name: "authority"
            });

          case 168:
            _context.t36 = _context.sent._id;
            _context.next = 171;
            return _Action["default"].findOne({
              name: "move"
            });

          case 171:
            _context.t37 = _context.sent._id;
            _context.t38 = [_context.t25, _context.t26, _context.t27, _context.t28, _context.t29, _context.t30, _context.t31, _context.t32, _context.t33, _context.t34, _context.t35, _context.t36, _context.t37];
            _context.t39 = tenant._id;
            _context.t40 = {
              name: "フルコントロール",
              description: "読み取り + 書き込み + 権限変更",
              actions: _context.t38,
              tenant_id: _context.t39
            };
            _context.t41 = [_context.t10, _context.t24, _context.t40];
            _context.next = 178;
            return _context.t3.insertMany.call(_context.t3, _context.t41);

          case 178:
            roleMenu1 = new _RoleMenu["default"]();
            roleMenu1.name = "一般ユーザ";
            roleMenu1.description = "";
            _context.next = 183;
            return _Menu["default"].findOne({
              name: "home"
            });

          case 183:
            _context.t42 = _context.sent._id;
            _context.next = 186;
            return _Menu["default"].findOne({
              name: "tags"
            });

          case 186:
            _context.t43 = _context.sent._id;
            roleMenu1.menus = [_context.t42, _context.t43];
            roleMenu1.tenant_id = tenant._id;
            _context.next = 191;
            return roleMenu1.save();

          case 191:
            roleMenu2 = new _RoleMenu["default"]();
            roleMenu2.name = "システム管理者";
            roleMenu2.description = "";
            _context.next = 196;
            return _Menu["default"].findOne({
              name: "home"
            });

          case 196:
            _context.t44 = _context.sent._id;
            _context.next = 199;
            return _Menu["default"].findOne({
              name: "tags"
            });

          case 199:
            _context.t45 = _context.sent._id;
            _context.next = 202;
            return _Menu["default"].findOne({
              name: "analysis"
            });

          case 202:
            _context.t46 = _context.sent._id;
            _context.next = 205;
            return _Menu["default"].findOne({
              name: "users"
            });

          case 205:
            _context.t47 = _context.sent._id;
            _context.next = 208;
            return _Menu["default"].findOne({
              name: "groups"
            });

          case 208:
            _context.t48 = _context.sent._id;
            _context.next = 211;
            return _Menu["default"].findOne({
              name: "role_files"
            });

          case 211:
            _context.t49 = _context.sent._id;
            _context.next = 214;
            return _Menu["default"].findOne({
              name: "role_menus"
            });

          case 214:
            _context.t50 = _context.sent._id;
            roleMenu2.menus = [_context.t44, _context.t45, _context.t46, _context.t47, _context.t48, _context.t49, _context.t50];
            roleMenu2.tenant_id = tenant._id;
            _context.next = 219;
            return roleMenu2.save();

          case 219:
            _context.next = 221;
            return _AuthorityMenu["default"].insertMany([{
              role_menus: roleMenu1._id,
              users: user1._id,
              groups: null
            }, {
              role_menus: roleMenu2._id,
              users: user2._id,
              groups: null
            }]);

          case 221:
            _context.next = 223;
            return _RoleFile["default"].findOne({
              name: "フルコントロール",
              tenant_id: tenant._id
            });

          case 223:
            role_file_full_controll = _context.sent;
            _context.next = 226;
            return _RoleFile["default"].findOne({
              name: "読み取りのみ",
              tenant_id: tenant._id
            });

          case 226:
            role_file_read_only = _context.sent;
            _context.next = 229;
            return _AuthorityFile["default"].insertMany([{
              files: topDir._id,
              role_files: role_file_read_only._id,
              users: null,
              groups: group1._id
            }, {
              files: trashDir._id,
              role_files: role_file_read_only._id,
              users: null,
              groups: group1._id
            }, {
              files: topDir._id,
              role_files: role_file_full_controll._id,
              users: null,
              groups: group2._id
            }, {
              files: trashDir._id,
              role_files: role_file_full_controll._id,
              users: null,
              groups: group2._id
            }]);

          case 229:
            _context.next = 231;
            return _MetaInfo["default"].findOne({
              name: "display_file_name"
            });

          case 231:
            display_file_name_id = _context.sent._id;
            _context.next = 234;
            return _MetaInfo["default"].findOne({
              name: "send_date_time"
            });

          case 234:
            send_date_time_id = _context.sent._id;
            _context.next = 237;
            return _DownloadInfo["default"].insertMany([{
              type: "file",
              value: "{".concat(display_file_name_id, "}{").concat(send_date_time_id, ":YYYYMMDD}{extension}"),
              tenant_id: tenant._id,
              extensionTarget: display_file_name_id
            }]);

          case 237:
            _context.next = 239;
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
              enable: false,
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

            }, {
              tenant_id: tenant._id,
              name: "full_text_search_enabled",
              description: "全文検索機能の利用を許可する。",
              enable: false,
              default_value: false // 許可しない

            }, {
              tenant_id: tenant._id,
              name: "export_excel_for_filelist",
              description: "ファイル一覧のexcel出力を許可する。",
              enable: false,
              default_value: false // 許可しない

            }, {
              tenant_id: tenant._id,
              name: "notification_from_app",
              description: "アプリケーションからの通知を許可する。",
              enable: false,
              default_value: false // 許可しない

            }, {
              tenant_id: tenant._id,
              name: "help_icon_on_app_bar",
              description: "APPバーにマニュアルへのリンクを表示する。",
              enable: false,
              default_value: false // 許可しない

            }]);

          case 239:
            _context.next = 241;
            return (0, _initElasticsearch["default"])(tenant_name);

          case 241:
            _context.next = 247;
            break;

          case 243:
            _context.prev = 243;
            _context.t51 = _context["catch"](0);
            console.log(_util["default"].inspect(_context.t51, false, null));

            _logger["default"].error(_context.t51); //process.exit();


          case 247:
            _context.prev = 247;
            console.log("################# add tenant end #################"); //process.exit();

            return _context.finish(247);

          case 250:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 243, 247, 250]]);
  }));

  return function task(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = task;
exports["default"] = _default;