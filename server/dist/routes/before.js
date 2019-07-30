"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/before"));

var router = (0, _express.Router)();
router.all("*", controller.verifyToken);
var _default = router;
exports["default"] = _default;