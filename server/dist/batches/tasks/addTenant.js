"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _mongoose = require("mongoose");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _Tenant = require("../../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _Dir = require("../../models/Dir");

var _Dir2 = _interopRequireDefault(_Dir);

var _File = require("../../models/File");

var _File2 = _interopRequireDefault(_File);

var _Group = require("../../models/Group");

var _Group2 = _interopRequireDefault(_Group);

var _User = require("../../models/User");

var _User2 = _interopRequireDefault(_User);

var _Action = require("../../models/Action");

var _Action2 = _interopRequireDefault(_Action);

var _Menu = require("../../models/Menu");

var _Menu2 = _interopRequireDefault(_Menu);

var _RoleFile = require("../../models/RoleFile");

var _RoleFile2 = _interopRequireDefault(_RoleFile);

var _RoleMenu = require("../../models/RoleMenu");

var _RoleMenu2 = _interopRequireDefault(_RoleMenu);

var _AuthorityMenu = require("../../models/AuthorityMenu");

var _AuthorityMenu2 = _interopRequireDefault(_AuthorityMenu);

var _AuthorityFile = require("../../models/AuthorityFile");

var _AuthorityFile2 = _interopRequireDefault(_AuthorityFile);

var _Preview = require("../../models/Preview");

var _Preview2 = _interopRequireDefault(_Preview);

var _AppSetting = require("../../models/AppSetting");

var _AppSetting2 = _interopRequireDefault(_AppSetting);

var _DownloadInfo = require("../../models/DownloadInfo");

var _DownloadInfo2 = _interopRequireDefault(_DownloadInfo);

var _Tag = require("../../models/Tag");

var _Tag2 = _interopRequireDefault(_Tag);

var _DisplayItem = require("../../models/DisplayItem");

var _DisplayItem2 = _interopRequireDefault(_DisplayItem);

var _MetaInfo = require("../../models/MetaInfo");

var _MetaInfo2 = _interopRequireDefault(_MetaInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// logger
var task = function task() {
  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var tenantName, _tenant, now, root_files, topDir, trashDir, dirs, tenant, group1, group2, pass, user1, user2, roleMenu1, roleMenu2, role_file_full_controll, role_file_read_only, display_file_name_id, send_date_time_id;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            console.log('start');

            if (process.argv[3]) {
              _context.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            tenantName = process.argv[3];
            _context.next = 7;
            return _Tenant2.default.findOne({ name: tenantName });

          case 7:
            _tenant = _context.sent;

            if (!_tenant) {
              _context.next = 10;
              break;
            }

            throw new Error("すでに存在しているテナントです");

          case 10:
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
            _context.next = 14;
            return _File2.default.insertMany(root_files);

          case 14:
            _context.next = 16;
            return _File2.default.findOne({ name: 'Top', modified: { "$gte": now } });

          case 16:
            topDir = _context.sent;
            _context.next = 19;
            return _File2.default.findOne({ name: 'Trash', modified: { "$gte": now } });

          case 19:
            trashDir = _context.sent;

            //console.log(topDir)
            //console.log(trashDir)

            //dirコレクション
            dirs = [{ ancestor: topDir._id, descendant: topDir._id, depth: 0 }, { ancestor: trashDir._id, descendant: trashDir._id, depth: 0 }, { ancestor: topDir._id, descendant: trashDir._id, depth: 1 }];
            _context.next = 23;
            return _Dir2.default.insertMany(dirs);

          case 23:

            // ===============================
            //  tenants collection
            // ===============================
            tenant = new _Tenant2.default();

            tenant.name = tenantName;
            tenant.home_dir_id = topDir._id;
            tenant.trash_dir_id = trashDir._id;
            tenant.threshold = 1024 * 1024 * 1024 * 100;
            _context.next = 30;
            return tenant.save();

          case 30:

            // ===============================
            // groups collection
            // ===============================
            group1 = new _Group2.default();

            group1.name = "全社";
            group1.description = "全社員が所属するグループ";
            group1.role_files = [];
            group1.tenant_id = tenant._id;
            _context.next = 37;
            return group1.save();

          case 37:
            group2 = new _Group2.default();

            group2.name = "管理者";
            group2.description = "システム管理者";
            group2.role_files = [];
            group2.tenant_id = tenant._id;
            _context.next = 44;
            return group2.save();

          case 44:

            // ===============================
            //  users collection
            // ===============================

            pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";
            user1 = new _User2.default();

            user1.type = "user";
            user1.account_name = tenantName + '2';
            user1.name = user1.account_name;
            user1.email = user1.account_name + '@' + tenantName;
            user1.password = pass;
            user1.enabled = true;
            _context.next = 54;
            return _Group2.default.findOne({ name: "全社", tenant_id: tenant._id }, { _id: 1 });

          case 54:
            _context.t0 = _context.sent._id;
            user1.groups = [_context.t0];

            user1.tenant_id = tenant._id;
            _context.next = 59;
            return user1.save();

          case 59:
            console.log("\u4E00\u822C\u30E6\u30FC\u30B6\u30FC " + user1.account_name + "\u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F");
            user2 = new _User2.default();

            user2.type = "user";
            user2.account_name = tenantName + '1';
            user2.name = user2.account_name;
            user2.email = user2.account_name + '@' + tenantName;
            user2.password = pass;
            user2.enabled = true;
            _context.next = 69;
            return _Group2.default.findOne({ name: "全社", tenant_id: tenant._id }, { _id: 1 });

          case 69:
            _context.t1 = _context.sent._id;
            user2.groups = [_context.t1];

            user2.tenant_id = tenant._id;
            _context.next = 74;
            return user2.save();

          case 74:
            console.log("\u7BA1\u7406\u30E6\u30FC\u30B6\u30FC " + user2.account_name + "\u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F");

            // ===============================
            //  tags collection
            // ===============================
            _context.next = 77;
            return _Tag2.default.insertMany([{
              color: "#f55",
              label: "非表示",
              tenant_id: tenant._id
            }]);

          case 77:
            _context.next = 79;
            return _DisplayItem2.default.insertMany([{
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
              is_excel: false,
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
              is_excel: false,
              is_search: true,
              between: true,
              width: "20%",
              order: 30,
              default_sort: { desc: true }
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

          case 79:
            _context.t2 = _RoleFile2.default;
            _context.next = 82;
            return _Action2.default.findOne({ name: "list" });

          case 82:
            _context.t3 = _context.sent._id;
            _context.next = 85;
            return _Action2.default.findOne({ name: "detail" });

          case 85:
            _context.t4 = _context.sent._id;
            _context.next = 88;
            return _Action2.default.findOne({ name: "history" });

          case 88:
            _context.t5 = _context.sent._id;
            _context.next = 91;
            return _Action2.default.findOne({ name: "download" });

          case 91:
            _context.t6 = _context.sent._id;
            _context.t7 = [_context.t3, _context.t4, _context.t5, _context.t6];
            _context.t8 = tenant._id;
            _context.t9 = {
              name: "読み取りのみ",
              description: "",
              actions: _context.t7,
              tenant_id: _context.t8
            };
            _context.next = 97;
            return _Action2.default.findOne({ name: "list" });

          case 97:
            _context.t10 = _context.sent._id;
            _context.next = 100;
            return _Action2.default.findOne({ name: "detail" });

          case 100:
            _context.t11 = _context.sent._id;
            _context.next = 103;
            return _Action2.default.findOne({ name: "history" });

          case 103:
            _context.t12 = _context.sent._id;
            _context.next = 106;
            return _Action2.default.findOne({ name: "download" });

          case 106:
            _context.t13 = _context.sent._id;
            _context.next = 109;
            return _Action2.default.findOne({ name: "change-name" });

          case 109:
            _context.t14 = _context.sent._id;
            _context.next = 112;
            return _Action2.default.findOne({ name: "change-tag" });

          case 112:
            _context.t15 = _context.sent._id;
            _context.next = 115;
            return _Action2.default.findOne({ name: "upload" });

          case 115:
            _context.t16 = _context.sent._id;
            _context.next = 118;
            return _Action2.default.findOne({ name: "makedir" });

          case 118:
            _context.t17 = _context.sent._id;
            _context.next = 121;
            return _Action2.default.findOne({ name: "copy" });

          case 121:
            _context.t18 = _context.sent._id;
            _context.next = 124;
            return _Action2.default.findOne({ name: "restore" });

          case 124:
            _context.t19 = _context.sent._id;
            _context.next = 127;
            return _Action2.default.findOne({ name: "delete" });

          case 127:
            _context.t20 = _context.sent._id;
            _context.t21 = [_context.t10, _context.t11, _context.t12, _context.t13, _context.t14, _context.t15, _context.t16, _context.t17, _context.t18, _context.t19, _context.t20];
            _context.t22 = tenant._id;
            _context.t23 = {
              name: "編集可能",
              description: "読み取り + 書き込み",
              actions: _context.t21,
              tenant_id: _context.t22
            };
            _context.next = 133;
            return _Action2.default.findOne({ name: "list" });

          case 133:
            _context.t24 = _context.sent._id;
            _context.next = 136;
            return _Action2.default.findOne({ name: "detail" });

          case 136:
            _context.t25 = _context.sent._id;
            _context.next = 139;
            return _Action2.default.findOne({ name: "history" });

          case 139:
            _context.t26 = _context.sent._id;
            _context.next = 142;
            return _Action2.default.findOne({ name: "download" });

          case 142:
            _context.t27 = _context.sent._id;
            _context.next = 145;
            return _Action2.default.findOne({ name: "change-name" });

          case 145:
            _context.t28 = _context.sent._id;
            _context.next = 148;
            return _Action2.default.findOne({ name: "change-tag" });

          case 148:
            _context.t29 = _context.sent._id;
            _context.next = 151;
            return _Action2.default.findOne({ name: "upload" });

          case 151:
            _context.t30 = _context.sent._id;
            _context.next = 154;
            return _Action2.default.findOne({ name: "makedir" });

          case 154:
            _context.t31 = _context.sent._id;
            _context.next = 157;
            return _Action2.default.findOne({ name: "copy" });

          case 157:
            _context.t32 = _context.sent._id;
            _context.next = 160;
            return _Action2.default.findOne({ name: "restore" });

          case 160:
            _context.t33 = _context.sent._id;
            _context.next = 163;
            return _Action2.default.findOne({ name: "delete" });

          case 163:
            _context.t34 = _context.sent._id;
            _context.next = 166;
            return _Action2.default.findOne({ name: "authority" });

          case 166:
            _context.t35 = _context.sent._id;
            _context.next = 169;
            return _Action2.default.findOne({ name: "move" });

          case 169:
            _context.t36 = _context.sent._id;
            _context.t37 = [_context.t24, _context.t25, _context.t26, _context.t27, _context.t28, _context.t29, _context.t30, _context.t31, _context.t32, _context.t33, _context.t34, _context.t35, _context.t36];
            _context.t38 = tenant._id;
            _context.t39 = {
              name: "フルコントロール",
              description: "読み取り + 書き込み + 権限変更",
              actions: _context.t37,
              tenant_id: _context.t38
            };
            _context.t40 = [_context.t9, _context.t23, _context.t39];
            _context.next = 176;
            return _context.t2.insertMany.call(_context.t2, _context.t40);

          case 176:
            roleMenu1 = new _RoleMenu2.default();


            roleMenu1.name = "一般ユーザ";
            roleMenu1.description = "";
            _context.next = 181;
            return _Menu2.default.findOne({ name: "home" });

          case 181:
            _context.t41 = _context.sent._id;
            _context.next = 184;
            return _Menu2.default.findOne({ name: "tags" });

          case 184:
            _context.t42 = _context.sent._id;
            roleMenu1.menus = [_context.t41, _context.t42];

            roleMenu1.tenant_id = tenant._id;
            _context.next = 189;
            return roleMenu1.save();

          case 189:
            roleMenu2 = new _RoleMenu2.default();

            roleMenu2.name = "システム管理者";
            roleMenu2.description = "";
            _context.next = 194;
            return _Menu2.default.findOne({ name: "home" });

          case 194:
            _context.t43 = _context.sent._id;
            _context.next = 197;
            return _Menu2.default.findOne({ name: "tags" });

          case 197:
            _context.t44 = _context.sent._id;
            _context.next = 200;
            return _Menu2.default.findOne({ name: "analysis" });

          case 200:
            _context.t45 = _context.sent._id;
            _context.next = 203;
            return _Menu2.default.findOne({ name: "users" });

          case 203:
            _context.t46 = _context.sent._id;
            _context.next = 206;
            return _Menu2.default.findOne({ name: "groups" });

          case 206:
            _context.t47 = _context.sent._id;
            _context.next = 209;
            return _Menu2.default.findOne({ name: "role_files" });

          case 209:
            _context.t48 = _context.sent._id;
            _context.next = 212;
            return _Menu2.default.findOne({ name: "role_menus" });

          case 212:
            _context.t49 = _context.sent._id;
            roleMenu2.menus = [_context.t43, _context.t44, _context.t45, _context.t46, _context.t47, _context.t48, _context.t49];

            roleMenu2.tenant_id = tenant._id;
            _context.next = 217;
            return roleMenu2.save();

          case 217:
            _context.next = 219;
            return _AuthorityMenu2.default.insertMany([{
              role_menus: roleMenu1._id,
              users: user1._id,
              groups: null
            }, {
              role_menus: roleMenu2._id,
              users: user2._id,
              groups: null
            }]);

          case 219:
            _context.next = 221;
            return _RoleFile2.default.findOne({ name: "フルコントロール", tenant_id: tenant._id });

          case 221:
            role_file_full_controll = _context.sent;
            _context.next = 224;
            return _RoleFile2.default.findOne({ name: "読み取りのみ", tenant_id: tenant._id });

          case 224:
            role_file_read_only = _context.sent;
            _context.next = 227;
            return _AuthorityFile2.default.insertMany([{
              files: topDir._id,
              role_files: role_file_read_only._id,
              users: null,
              groups: group1._id
            }, {
              files: trashDir._id,
              role_files: role_file_read_only._id,
              users: null,
              groups: group1._id
            }]);

          case 227:
            _context.next = 229;
            return _AuthorityFile2.default.insertMany([{
              files: topDir._id,
              role_files: role_file_full_controll._id,
              users: user2._id,
              groups: null
            }, {
              files: trashDir._id,
              role_files: role_file_full_controll._id,
              users: user2._id,
              groups: null
            }]);

          case 229:
            _context.next = 231;
            return _MetaInfo2.default.findOne({ name: "display_file_name" });

          case 231:
            display_file_name_id = _context.sent._id;
            _context.next = 234;
            return _MetaInfo2.default.findOne({ name: "send_date_time" });

          case 234:
            send_date_time_id = _context.sent._id;
            _context.next = 237;
            return _DownloadInfo2.default.insertMany([{
              type: "file",
              value: "{" + display_file_name_id + "}{" + send_date_time_id + ":YYYYMMDD}{extension}",
              tenant_id: tenant._id,
              extensionTarget: display_file_name_id
            }]);

          case 237:
            _context.next = 239;
            return _AppSetting2.default.insertMany([{
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
            }]);

          case 239:
            _context.next = 246;
            break;

          case 241:
            _context.prev = 241;
            _context.t50 = _context["catch"](0);

            console.log(_util2.default.inspect(_context.t50, false, null));
            _logger2.default.error(_context.t50);
            process.exit();

          case 246:
            _context.prev = 246;

            _logger2.default.info("################# add tenant end #################");
            process.exit();
            return _context.finish(246);

          case 250:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 241, 246, 250]]);
  }));
};

// models
exports.default = task;