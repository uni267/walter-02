"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var controller = _interopRequireWildcard(require("../controllers/elasticsearches"));

var router = (0, _express.Router)(); // 検索用インデックス更新

router.route("/reindex").post(controller.reIndex);
router.route("/reindex_all").get(controller.reIndexAll);
router.route("/reindex_search_detail").post(controller.reIndexSearchResult);
var _default = router;
exports["default"] = _default;