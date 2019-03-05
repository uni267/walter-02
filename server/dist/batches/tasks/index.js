"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTenantWTask = exports.addTenantTask = exports.deleteAdminTask = exports.createAdminTask = exports.moveInvisibleFilesTask = exports.reCreateElasticCacheTask = exports.initElasticsearchTask = exports.AnalyzeTask = undefined;

var _analyze = require("./analyze");

var _analyze2 = _interopRequireDefault(_analyze);

var _initElasticsearch = require("./initElasticsearch");

var _initElasticsearch2 = _interopRequireDefault(_initElasticsearch);

var _moveInvisibleFiles = require("./moveInvisibleFiles");

var _moveInvisibleFiles2 = _interopRequireDefault(_moveInvisibleFiles);

var _createAdmin = require("./createAdmin");

var _createAdmin2 = _interopRequireDefault(_createAdmin);

var _deleteAdmin = require("./deleteAdmin");

var _deleteAdmin2 = _interopRequireDefault(_deleteAdmin);

var _addTenant = require("./addTenant");

var _addTenant2 = _interopRequireDefault(_addTenant);

var _initTenantW = require("./initTenantW");

var _initTenantW2 = _interopRequireDefault(_initTenantW);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnalyzeTask = exports.AnalyzeTask = function AnalyzeTask() {
  return (0, _analyze2.default)();
};

var initElasticsearchTask = exports.initElasticsearchTask = function initElasticsearchTask() {
  return (0, _initElasticsearch2.default)();
};
var reCreateElasticCacheTask = exports.reCreateElasticCacheTask = function reCreateElasticCacheTask() {
  return (0, _initElasticsearch.reCreateElasticCache)();
};

var moveInvisibleFilesTask = exports.moveInvisibleFilesTask = function moveInvisibleFilesTask() {
  return (0, _moveInvisibleFiles2.default)();
};

var createAdminTask = exports.createAdminTask = function createAdminTask() {
  return (0, _createAdmin2.default)();
};

var deleteAdminTask = exports.deleteAdminTask = function deleteAdminTask() {
  return (0, _deleteAdmin2.default)();
};

var addTenantTask = exports.addTenantTask = function addTenantTask() {
  return (0, _addTenant2.default)();
};

var initTenantWTask = exports.initTenantWTask = function initTenantWTask() {
  return (0, _initTenantW2.default)();
};