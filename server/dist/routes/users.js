"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _crypto = _interopRequireDefault(require("crypto"));

var _User = _interopRequireDefault(require("../models/User"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _Group = _interopRequireDefault(require("../models/Group"));

var controllers = _interopRequireWildcard(require("../controllers/users"));

var router = (0, _express.Router)();
router.route("/").get(controllers.index) // 一覧
.post(controllers.add); // 作成

router.route("/with_groups").get(controllers.getWithGroups);
router.route("/:user_id").get(controllers.view) // 詳細
["delete"](controllers.remove); // 削除

router.route("/:user_id/groups").post(controllers.addUserToGroup); // 所属グループの追加

router.route("/:user_id/password").patch(controllers.updatePassword); // パスワード変更

router.route("/:user_id/password_force").patch(controllers.updatePasswordForce); // パスワード変更(管理者)

router.route("/:user_id/enabled").patch(controllers.toggleEnabled); // 有効/無効

router.route("/:user_id/account_name").patch(controllers.updateAccountName); // アカウント名変更

router.route("/:user_id/name").patch(controllers.updateName); // 表示名変更

router.route("/:user_id/email").patch(controllers.updateEmail); // メールアドレス変更

router.route("/:user_id/groups").post(controllers.addUserToGroup); // 所属グループの追加

router.route("/:user_id/groups/:group_id")["delete"](controllers.removeUserOfGroup); // 所属グループの削除

router.route("/:user_id/role_menus").patch(controllers.updateRoleMenus); // role_menusの変更

var _default = router;
exports["default"] = _default;