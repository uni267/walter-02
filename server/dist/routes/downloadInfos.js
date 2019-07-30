"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/downloadInfos"));

var router = (0, _express.Router)();
router.post("/", controller.add);
router.put("/:downloadinfo_id/update", controller.update);
router.get("/:downloadinfo_type", controller.index);
var _default = router;
exports["default"] = _default;