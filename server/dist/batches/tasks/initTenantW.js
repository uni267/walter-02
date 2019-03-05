"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _mongoose = require("mongoose");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// logger
var task = async function task() {
  try {

    console.log('addTenantバッチにより追加されたテナントに対し、カスタマイズします。');

    if (!process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
    //テナント名をfindしてなければアウト
    var tenantName = process.argv[3];
    var tenant = await _Tenant2.default.findOne({ name: tenantName });
    if (!tenant) throw new Error("存在しないテナントです");
    console.log("\u30C6\u30CA\u30F3\u30C8 " + tenant.name + "(" + tenant._id + ") \u306E\u8A2D\u5B9A\u3092\u66F4\u65B0\u3057\u307E\u3059\u3002");
    console.log('start');

    // ===============================
    //  テナント毎のグローバル設定(app_settings)
    // ===============================
    await _AppSetting2.default.remove({ tenant_id: tenant._id });
    await _AppSetting2.default.insertMany([{
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

    // ユーザーグループの変更
    await _Group2.default.update({ name: "全社", tenant_id: tenant._id }, { $set: { name: '基本ユーザーG' } }, { multi: false });
    await _Group2.default.update({ name: "管理者", tenant_id: tenant._id }, { $set: { name: 'ファイル管理者G' } }, { multi: false });
    var group_norm = await _Group2.default.findOne({ name: '基本ユーザーG' });
    var group_file = await _Group2.default.findOne({ name: 'ファイル管理者G' });
    // 既存RoleMenuの削除
    var existing_rolemenu_ids = (await _RoleMenu2.default.find({ tenant_id: tenant._id })).map(function (rolemenu) {
      return rolemenu._id.toString();
    });
    await Promise.all(_.forEach(existing_rolemenu_ids, async function (id) {
      await _AuthorityMenu2.default.remove({ role_menus: _mongoose.Types.ObjectId(id) });
      await _RoleMenu2.default.remove({ _id: _mongoose.Types.ObjectId(id) });
    }));
    // RoleMenuの追加
    var roleMenu_norm = new _RoleMenu2.default();
    roleMenu_norm.name = "一般ユーザ";
    roleMenu_norm.description = "";
    roleMenu_norm.menus = [(await _Menu2.default.findOne({ name: "home" }))._id];
    roleMenu_norm.tenant_id = tenant._id;
    await roleMenu_norm.save();

    var roleMenu_file = new _RoleMenu2.default();
    roleMenu_file.name = "ファイル管理者";
    roleMenu_file.description = "";
    roleMenu_file.menus = [(await _Menu2.default.findOne({ name: "home" }))._id, (await _Menu2.default.findOne({ name: "tags" }))._id, (await _Menu2.default.findOne({ name: "users" }))._id];
    roleMenu_file.tenant_id = tenant._id;
    await roleMenu_file.save();

    var roleMenu_sa = new _RoleMenu2.default();
    roleMenu_sa.name = "システム管理者";
    roleMenu_sa.description = "";
    roleMenu_sa.menus = [(await _Menu2.default.findOne({ name: "home" }))._id, (await _Menu2.default.findOne({ name: "tags" }))._id, (await _Menu2.default.findOne({ name: "analysis" }))._id, (await _Menu2.default.findOne({ name: "users" }))._id, (await _Menu2.default.findOne({ name: "groups" }))._id, (await _Menu2.default.findOne({ name: "role_files" }))._id, (await _Menu2.default.findOne({ name: "role_menus" }))._id];
    roleMenu_sa.tenant_id = tenant._id;
    await roleMenu_sa.save();

    //既存RoleFileの削除
    var existing_rolefile_ids = (await _RoleFile2.default.find({ tenant_id: tenant._id })).map(function (rolefile) {
      return rolefile._id.toString();
    });
    await Promise.all(_.forEach(existing_rolefile_ids, async function (id) {
      await _AuthorityFile2.default.remove({ role_files: _mongoose.Types.ObjectId(id) });
      await _RoleFile2.default.remove({ _id: _mongoose.Types.ObjectId(id) });
    }));

    // RoleFileの追加
    await _RoleFile2.default.insertMany([{
      name: "読み取りのみ",
      description: "",
      actions: [(await _Action2.default.findOne({ name: "list" }))._id, (await _Action2.default.findOne({ name: "detail" }))._id, (await _Action2.default.findOne({ name: "download" }))._id],
      tenant_id: tenant._id
    }, {
      name: "読み取り+アップロード",
      description: "読み取り+アップロード",
      actions: [(await _Action2.default.findOne({ name: "list" }))._id, (await _Action2.default.findOne({ name: "detail" }))._id, (await _Action2.default.findOne({ name: "download" }))._id, (await _Action2.default.findOne({ name: "upload" }))._id],
      tenant_id: tenant._id
    }, {
      name: "フルコントロール",
      description: "読み取り + 書き込み + 権限変更",
      actions: [(await _Action2.default.findOne({ name: "list" }))._id, (await _Action2.default.findOne({ name: "detail" }))._id, (await _Action2.default.findOne({ name: "download" }))._id, (await _Action2.default.findOne({ name: "change-name" }))._id, (await _Action2.default.findOne({ name: "change-tag" }))._id, (await _Action2.default.findOne({ name: "upload" }))._id, (await _Action2.default.findOne({ name: "makedir" }))._id, (await _Action2.default.findOne({ name: "move" }))._id, (await _Action2.default.findOne({ name: "restore" }))._id, (await _Action2.default.findOne({ name: "delete" }))._id, (await _Action2.default.findOne({ name: "dir-authority" }))._id],
      tenant_id: tenant._id
    }]);

    var role_file_full_controll = await _RoleFile2.default.findOne({ name: "フルコントロール", tenant_id: tenant._id });
    var role_file_read_upload = await _RoleFile2.default.findOne({ name: "読み取り+アップロード", tenant_id: tenant._id });
    var role_file_read_only = await _RoleFile2.default.findOne({ name: "読み取りのみ", tenant_id: tenant._id });

    // Topとtrashフォルダの権限設定
    await _AuthorityFile2.default.insertMany([{
      files: tenant.home_dir_id,
      role_files: role_file_full_controll._id,
      users: null,
      groups: group_file._id
    }, {
      files: tenant.home_dir_id,
      role_files: role_file_read_only._id,
      users: null,
      groups: group_norm._id
    }, {
      files: tenant.trash_dir_id,
      role_files: role_file_full_controll._id,
      users: null,
      groups: group_file._id
    }, {
      files: tenant.trash_dir_id,
      role_files: role_file_read_only._id,
      users: null,
      groups: group_norm._id
    }]);

    //既存ユーザーの削除
    var existing_user_ids = (await _User2.default.find({ tenant_id: tenant._id })).map(function (user) {
      return user._id.toString();
    });
    await Promise.all(_.forEach(existing_user_ids, async function (id) {
      await _AuthorityMenu2.default.remove({ users: _mongoose.Types.ObjectId(id) });
      await _User2.default.remove({ _id: _mongoose.Types.ObjectId(id) });
    }));
    //初期ユーザー作成
    var pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";
    var user_sa = new _User2.default();
    user_sa.type = "user";
    user_sa.account_name = "cyber-sa";
    user_sa.name = "システム管理者";
    user_sa.email = user_sa.account_name + "@" + tenantName;
    user_sa.password = pass;
    user_sa.enabled = true;
    user_sa.groups = [(await _Group2.default.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, { _id: 1 }))._id];
    user_sa.tenant_id = tenant._id;
    await user_sa.save();

    var user_center = new _User2.default();
    user_center.type = "user";
    user_center.account_name = "wakayama";
    user_center.name = "管理者";
    user_center.email = user_sa.account_name + "@" + tenantName;
    user_center.password = pass;
    user_center.enabled = true;
    user_center.groups = [(await _Group2.default.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, { _id: 1 }))._id, (await _Group2.default.findOne({ name: "ファイル管理者G", tenant_id: tenant._id }, { _id: 1 }))._id];
    user_center.tenant_id = tenant._id;
    await user_center.save();

    await _AuthorityMenu2.default.insertMany([{
      role_menus: roleMenu_sa._id,
      users: user_sa._id,
      groups: null
    }, {
      role_menus: roleMenu_file._id,
      users: user_center._id,
      groups: null
    }]);

    var normal_users = [{ account_name: 'nourin', name: '農林水産部' }, { account_name: 'soumu', name: '総務部' }, { account_name: 'fukushi', name: '福祉保健部' }, { account_name: 'kendo', name: '県土整備部' }, { account_name: 'kankyo', name: '環境生活部' }, { account_name: 'syoko', name: '商工観光労働部' }, { account_name: 'kikaku', name: '企画部' }];

    await Promise.all(_.map(normal_users, async function (inf) {
      var user = new _User2.default();
      user.type = "user";
      user.account_name = inf.account_name;
      user.name = inf.name;
      user.email = user.account_name + "@" + tenantName;
      user.password = pass;
      user.enabled = true;
      user.groups = [(await _Group2.default.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, { _id: 1 }))._id];
      user.tenant_id = tenant._id;
      await user.save();
      await _AuthorityMenu2.default.insertMany([{
        role_menus: roleMenu_norm._id,
        users: user._id,
        groups: null
      }]);
    }));

    // ===============================
    //  tags collection
    // ===============================
    await _Tag2.default.remove({ tenant_id: tenant._id }); //テナントid一致分を全てクリア
    var tags = [{ color: "#f44336", label: "分析種 経済分析" }, { color: "#e91e63", label: "分析種 社会分析" }, { color: "#9c27b0", label: "分析種 その他" }, { color: "#673ab7", label: "分野 暮らし" }, { color: "#3f51b5", label: "分野 環境" }, { color: "#2196f3", label: "分野 農林業" }, { color: "#03a9f4", label: "分野 漁業" }, { color: "#00bcd4", label: "分野 産業" }, { color: "#009688", label: "分野 観光" }, { color: "#4caf50", label: "分野 移住定住" }, { color: "#8bc34a", label: "分野 健康・医療" }, { color: "#cddc39", label: "分野 福祉" }, { color: "#ffeb3b", label: "分野 教育" }, { color: "#ffc107", label: "分野 文化" }, { color: "#ff9800", label: "分野 まちづくり" }, { color: "#ff5722", label: "分野 交通" }, { color: "#795548", label: "分野 防災" }, { color: "#607d8b", label: "分野 その他" }];
    await Promise.all(_.map(tags, async function (tag) {
      return await _Tag2.default.insertMany([{
        color: tag.color,
        label: tag.label,
        tenant_id: tenant._id
      }]);
    }));

    var existing_file_ids = (await _Dir2.default.find({ ancestor: tenant.home_dir_id, depth: 1, descendant: { '$ne': tenant.trash_dir_id } })).map(function (dir) {
      return dir.descendant.toString();
    });
    await Promise.all(_.map(existing_file_ids, async function (id) {
      await _File2.default.remove({ _id: _mongoose.Types.ObjectId(id) });
      await _AuthorityFile2.default.remove({ files: _mongoose.Types.ObjectId(id) });
      await _Dir2.default.remove({ descendant: _mongoose.Types.ObjectId(id) });
    }));

    //デフォルトフォルダの準備
    await Promise.all(_.map(normal_users, async function (inf) {
      var dir = new _File2.default();
      dir.name = inf.name;
      dir.modified = (0, _moment2.default)().format("YYYY-MM-DD HH:mm:ss");
      dir.is_dir = true;
      dir.dir_id = tenant.home_dir_id;
      dir.is_display = true;
      dir.is_star = false;
      dir.tags = [];
      dir.histories = [];
      dir.authorities = [];

      // 管理者フルコントロール
      var authFileDefault = new _AuthorityFile2.default();
      authFileDefault.users = user_center;
      authFileDefault.files = dir;
      authFileDefault.role_files = role_file_full_controll;
      // 共有ユーザー
      var authFileShare = new _AuthorityFile2.default();
      authFileShare.users = await _User2.default.findOne({ account_name: inf.account_name, tenant_id: tenant._id }, { _id: 1 });
      authFileShare.files = dir;
      authFileShare.role_files = role_file_read_upload;
      dir.authority_files = [authFileDefault, authFileShare];
      //console.log(`フォルダ '${inf.name}' が作成開始`)

      await dir.save();
      await authFileDefault.save();
      await authFileShare.save();
      await _Dir2.default.insertMany([{
        ancestor: dir._id,
        descendant: dir._id,
        depth: 0
      }, {
        ancestor: tenant.home_dir_id,
        descendant: dir._id,
        depth: 1
      }]);
      console.log("\u30D5\u30A9\u30EB\u30C0 '" + inf.name + "' \u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F");
    }));
  } catch (e) {
    console.log(e);
    console.log(_util2.default.inspect(e, false, null));
    _logger2.default.error(e);
    process.exit();
  } finally {
    console.log('end');
    _logger2.default.info("################# init wak tenant end #################");
    process.exit();
  }
};

// models
exports.default = task;