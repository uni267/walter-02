"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/appSettings"));

var router = (0, _express.Router)();
router.route("/").get(controller.index);
var _default = router;
exports["default"] = _default;