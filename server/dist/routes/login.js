"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/login"));

var router = (0, _express.Router)();
router.route("/").post(controller.authentication);
router.route("/verify_token").post(controller.verifyToken);
var _default = router;
exports["default"] = _default;