"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/roleFiles"));

var router = (0, _express.Router)(); // 一覧, 作成

router.route("/").get(controller.index).post(controller.create); // 詳細, 削除

router.route("/:role_id").get(controller.view)["delete"](controller.remove); // 名前変更

router.route("/:role_id/name").patch(controller.updateName); // 備考変更

router.route("/:role_id/description").patch(controller.updateDescription); // action追加,削除

router.route("/:role_id/actions/:action_id").patch(controller.addActionToRoleFile)["delete"](controller.removeActionOfRoleFile);
var _default = router;
exports["default"] = _default;