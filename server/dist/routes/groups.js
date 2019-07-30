"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/groups"));

var router = (0, _express.Router)();
router.route("/").get(controller.index).post(controller.create);
router.route("/:group_id").get(controller.view)["delete"](controller.remove);
router.route("/:group_id/name").patch(controller.updateName);
router.route("/:group_id/description").patch(controller.updateDescription);
router.route("/:group_id/role_menus").patch(controller.updateRoleMenus);
var _default = router;
exports["default"] = _default;