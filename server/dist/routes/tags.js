"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/tags"));

var router = (0, _express.Router)(); // 一覧

router.route("/").get(controller.index).post(controller.create); // 詳細

router.route("/:tag_id").get(controller.view)["delete"](controller.remove); // label変更

router.route("/:tag_id/label").patch(controller.changeLabel); // color変更

router.route("/:tag_id/color").patch(controller.changeColor); // 並び順一括変更

router.route("/order_number").patch(controller.changeOrderNumber);
var _default = router;
exports["default"] = _default;