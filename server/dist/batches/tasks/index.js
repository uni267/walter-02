"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDbTask = exports.addTimestampSettingTask = exports.initTenantWTask = exports.addTenantTask = exports.deleteAdminTask = exports.createAdminTask = exports.moveInvisibleFilesTask = exports.reCreateElasticCacheTask = exports.initElasticsearchTask = exports.AnalyzeTask = void 0;

var _analyze = _interopRequireDefault(require("./analyze"));

var _initElasticsearch = _interopRequireWildcard(require("./initElasticsearch"));

var _addTenant = _interopRequireDefault(require("./addTenant"));

var _initTenantW = _interopRequireDefault(require("./initTenantW"));

var _addTimestampSetting = _interopRequireDefault(require("./addTimestampSetting"));

var _initDatabase = _interopRequireDefault(require("./initDatabase"));

//import moveInvisibleFiles from "./moveInvisibleFiles";
//import createAdmin from "./createAdmin";
//import deleteAdmin from "./deleteAdmin";
var AnalyzeTask = function AnalyzeTask() {
  return (0, _analyze["default"])();
};

exports.AnalyzeTask = AnalyzeTask;

var initElasticsearchTask = function initElasticsearchTask() {
  return (0, _initElasticsearch["default"])();
};

exports.initElasticsearchTask = initElasticsearchTask;

var reCreateElasticCacheTask = function reCreateElasticCacheTask() {
  return (0, _initElasticsearch.reCreateElasticCache)();
};

exports.reCreateElasticCacheTask = reCreateElasticCacheTask;

var moveInvisibleFilesTask = function moveInvisibleFilesTask() {
  return moveInvisibleFiles();
};

exports.moveInvisibleFilesTask = moveInvisibleFilesTask;

var createAdminTask = function createAdminTask() {
  return createAdmin();
};

exports.createAdminTask = createAdminTask;

var deleteAdminTask = function deleteAdminTask() {
  return deleteAdmin();
};

exports.deleteAdminTask = deleteAdminTask;

var addTenantTask = function addTenantTask() {
  return (0, _addTenant["default"])();
};

exports.addTenantTask = addTenantTask;

var initTenantWTask = function initTenantWTask() {
  return (0, _initTenantW["default"])();
};

exports.initTenantWTask = initTenantWTask;

var addTimestampSettingTask = function addTimestampSettingTask() {
  return (0, _addTimestampSetting["default"])();
};

exports.addTimestampSettingTask = addTimestampSettingTask;

var initDbTask = function initDbTask() {
  return (0, _initDatabase["default"])();
};

exports.initDbTask = initDbTask;