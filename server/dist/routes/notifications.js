"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/notifications"));

var router = (0, _express.Router)();
router.get("/", controller.view) // お知らせ一覧取得
.post("/", controller.add); // お知らせの追加
// すべてのお知らせ一覧取得

router.get("/all", controller.index); // 既読に更新

router.patch("/read", controller.updateRead); // 未読に更新

router.patch("/unread", controller.updateUnRead);
var _default = router;
exports["default"] = _default;