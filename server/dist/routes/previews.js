"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controllers = _interopRequireWildcard(require("../controllers/previews"));

var router = (0, _express.Router)();
router.route("/:preview_id").get(controllers.image); // プレビュー画像

var _default = router;
exports["default"] = _default;