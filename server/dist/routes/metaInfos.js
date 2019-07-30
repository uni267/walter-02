"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controllers = _interopRequireWildcard(require("../controllers/metaInfos"));

var router = (0, _express.Router)();
router.route("/").get(controllers.index) // 一覧
.post(controllers.add); // 作成

router.route("/value_type").get(controllers.valueType); // データ型一覧

router.route("/:metainfo_id").get(controllers.view); // 詳細

router.route("/:metainfo_id/label").patch(controllers.updateLabel); // 表示名更新

router.route("/:metainfo_id/name").patch(controllers.updateName); // 表示名更新

var _default = router;
exports["default"] = _default;