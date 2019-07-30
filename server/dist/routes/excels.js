"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/excels"));

var router = (0, _express.Router)(); // excel形式でダウンロード

router.get("/", controller.index);
router.get("/search", controller.search);
router.post("/search_detail", controller.searchDetail);
var _default = router;
exports["default"] = _default;