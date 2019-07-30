"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _before = _interopRequireDefault(require("./before"));

var _login = _interopRequireDefault(require("./login"));

var _users = _interopRequireDefault(require("./users"));

var _files = _interopRequireDefault(require("./files"));

var _dirs = _interopRequireDefault(require("./dirs"));

var _tags = _interopRequireDefault(require("./tags"));

var _metaInfos = _interopRequireDefault(require("./metaInfos"));

var _groups = _interopRequireDefault(require("./groups"));

var _roleFiles = _interopRequireDefault(require("./roleFiles"));

var _roleMenus = _interopRequireDefault(require("./roleMenus"));

var _actions = _interopRequireDefault(require("./actions"));

var _analysis = _interopRequireDefault(require("./analysis"));

var _clients = _interopRequireDefault(require("./clients"));

var _previews = _interopRequireDefault(require("./previews"));

var _authorityFiles = _interopRequireDefault(require("./authorityFiles"));

var _authorityMenus = _interopRequireDefault(require("./authorityMenus"));

var _menus = _interopRequireDefault(require("./menus"));

var _notifications = _interopRequireDefault(require("./notifications"));

var _displayItems = _interopRequireDefault(require("./displayItems"));

var _excels = _interopRequireDefault(require("./excels"));

var _elasticsearches = _interopRequireDefault(require("./elasticsearches"));

var _downloadInfos = _interopRequireDefault(require("./downloadInfos"));

var _appSettings = _interopRequireDefault(require("./appSettings"));

// debug
// import TestRouter from "./test";
var router = (0, _express.Router)();
router.use("/api/v1/*", _before["default"]);
router.use("/api/login", _login["default"]);
router.use("/api/v1/users", _users["default"]);
router.use("/api/v1/files", _files["default"]);
router.use("/api/v1/elasticsearch", _elasticsearches["default"]);
router.use("/api/v1/dirs", _dirs["default"]);
router.use("/api/v1/tags", _tags["default"]);
router.use("/api/v1/meta_infos", _metaInfos["default"]);
router.use("/api/v1/groups", _groups["default"]);
router.use("/api/v1/role_files", _roleFiles["default"]);
router.use("/api/v1/role_menus", _roleMenus["default"]);
router.use("/api/v1/actions", _actions["default"]);
router.use("/api/v1/analysis", _analysis["default"]);
router.use("/api/v1/previews", _previews["default"]);
router.use("/api/v1/authority_files", _authorityFiles["default"]);
router.use("/api/v1/authority_menus", _authorityMenus["default"]);
router.use("/api/v1/menus", _menus["default"]);
router.use("/api/v1/notifications", _notifications["default"]);
router.use("/api/v1/display_items", _displayItems["default"]);
router.use("/api/v1/excels", _excels["default"]);
router.use("/api/v1/download_info", _downloadInfos["default"]);
router.use("/api/v1/app_settings", _appSettings["default"]);
router.use("/*", _clients["default"]); // debug
// router.use("/test", TestRouter);

var _default = router;
exports["default"] = _default;