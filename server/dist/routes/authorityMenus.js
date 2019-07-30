"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/authorityMenus"));

var router = (0, _express.Router)(); // ユーザの権限を取得

router.get("/", controller.index);
var _default = router;
exports["default"] = _default;