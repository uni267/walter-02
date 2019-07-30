"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = _interopRequireDefault(require("util"));

var _elasticsearch = _interopRequireDefault(require("@elastic/elasticsearch"));

var _server = require("../configs/server");

var _co = _interopRequireDefault(require("co"));

var _constants = require("../configs/constants");

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var mode = process.env.NODE_ENV;
var erasticsearchUrl;
var erasticsearchErrorLevel;

switch (mode) {
  case "integration":
    erasticsearchUrl = "".concat(_server.ELASTICSEARCH_CONF.integration.url, ":").concat(_server.ELASTICSEARCH_CONF.integration.port);
    erasticsearchErrorLevel = _server.ELASTICSEARCH_CONF.integration.logLevel;
    break;

  case "production":
    if (!process.env.ELASTIC_HOST_NAME) throw new Error("env.ELASTIC_HOST_NAME is not set");
    erasticsearchUrl = "".concat(_server.ELASTICSEARCH_CONF.production.url, ":").concat(_server.ELASTICSEARCH_CONF.production.port);
    erasticsearchErrorLevel = _server.ELASTICSEARCH_CONF.production.logLevel;
    break;

  default:
    erasticsearchUrl = "".concat(_server.ELASTICSEARCH_CONF.development.url, ":").concat(_server.ELASTICSEARCH_CONF.development.port);
    erasticsearchErrorLevel = _server.ELASTICSEARCH_CONF.development.logLevel;
    break;
}

var esClient = new _elasticsearch["default"].Client({
  node: erasticsearchUrl,
  requestTimeout: _constants.ELASTIC_INDEXING_TIMEOUT
});

esClient.createIndex =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenant_id, files) {
    var bulkBody, appSetting, timestampOptionEnabled, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            bulkBody = [];
            _context.next = 4;
            return _AppSetting["default"].findOne({
              tenant_id: tenant_id,
              name: _AppSetting["default"].TIMESTAMP_PERMISSION
            });

          case 4:
            appSetting = _context.sent;
            timestampOptionEnabled = !!appSetting && !!appSetting.enable;
            files.forEach(function (file) {
              bulkBody.push({
                index: {
                  _index: tenant_id,
                  _type: "files",
                  _id: file._id
                }
              });
              var tags = file.tags.map(function (t) {
                return t._id;
              });
              var esFile = {
                _id: file._id,
                name: file.name,
                mime_type: file.mime_type,
                size: file.size,
                is_dir: file.is_dir,
                dir_id: file.dir_id,
                is_display: file.is_display,
                is_star: file.is_star,
                is_trash: file.is_trash,
                is_crypted: file.is_crypted,
                is_deleted: file.is_deleted,
                modified: file.modified,
                preview_id: file.preview_id,
                sort_target: file.sort_target,
                unvisible: file.unvisible,
                tag: tags,
                full_text: file.full_text,
                meta_text: file.meta_text
              };
              file.meta_infos.filter(function (m) {
                return m.name !== "timestamp";
              }).forEach(function (meta) {
                esFile[meta._id.toString()] = meta.value;
              }); // タグ検索(2018-01-05:マスタ更新に対応できないのでコメントアウト)
              // file.tags.forEach(tag => {
              //   esFile[tag._id.toString()] = tag.label;
              // });

              esFile.actions = {}; // 簡易検索でユーザ名で検索するためユーザ名を文字列として保持する(2018-01-05:マスタ更新に対応できないのでコメントアウト)
              // esFile.users = "";
              // 詳細検索ではuser._idで引き当てたい

              file.authorities.forEach(function (authority, index) {
                authority.actions.forEach(function (action, idx) {
                  if (esFile.actions[action._id] === undefined) esFile.actions[action._id] = [];

                  if (authority.users !== undefined && authority.users !== null) {
                    esFile.actions[action._id].push(authority.users._id);
                  }

                  if (authority.groups !== undefined && authority.groups !== null) {
                    esFile.actions[action._id].push(authority.groups._id);
                  }
                });
              });

              if (timestampOptionEnabled) {
                var tsMetaInfo = file.meta_infos.find(function (m) {
                  return m.name === "timestamp";
                });

                if (!!tsMetaInfo && tsMetaInfo.value.length > 0) {
                  var tst = tsMetaInfo.value[tsMetaInfo.value.length - 1];
                  esFile.tstStatus = tst.status;
                  esFile.tstExpirationDate = tst.expirationDate;
                }
              }

              bulkBody.push({
                file: esFile
              });
            });
            _context.next = 9;
            return esClient.bulk({
              refresh: "true",
              body: bulkBody
            });

          case 9:
            result = _context.sent;

            if (!result.errors) {
              _context.next = 12;
              break;
            }

            throw result.items[0].index;

          case 12:
            return _context.abrupt("return", Promise.resolve(result));

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", Promise.reject(_context.t0));

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

esClient.syncDocument =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(tenant_id, file) {
    var org_file;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return esClient.getFile(tenant_id.toString(), file._id);

          case 2:
            org_file = _context2.sent;
            file.full_text = org_file.full_text;
            file.meta_text = org_file.meta_text;
            _context2.next = 7;
            return esClient.createIndex(tenant_id, [file]);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}(); //全文検索用フィールドの更新


esClient.updateTextContents =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(tenant_id, file_id, meta_text, full_text) {
    var script_helper;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            script_helper = function script_helper(str) {
              var converted = str.replace(/　/g, ' ') //全角スペース→半角スペース
              .replace(/\n|\r\n|\r/g, ' ') //改行コード→半角スペース
              .replace(/\'/g, '\\\'') //シングルクオーテーションのエスケープ
              .replace(/ {2,}/g, ' '); //連続するスペース→単一半角スペース

              return converted !== null ? "'".concat(converted, "'") : "null";
            };

            _context3.next = 3;
            return esClient.updateByQuery({
              index: tenant_id,
              type: "files",
              body: {
                "query": {
                  "bool": {
                    "must": [{
                      "term": {
                        "_id": file_id
                      }
                    }]
                  }
                },
                "script": "ctx._source.file.full_text = " + script_helper(full_text) + ";" + "ctx._source.file.meta_text = " + script_helper(meta_text) + ";"
              }
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}(); // file_idよりfile情報を取得


esClient.getFile =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(tenant_id, file_id) {
    var result;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return esClient.search({
              index: tenant_id,
              type: "files",
              body: {
                "query": {
                  "term": {
                    "_id": file_id
                  }
                }
              }
            });

          case 2:
            result = _context4.sent;
            return _context4.abrupt("return", result.body.hits.hits[0]._source.file);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}(); // 検索結果として全件を返す


esClient.searchAll =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(query) {
    var query_for_count, result;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            // elasticsearchが無制限にレコードを取得できないので一度totalを取得してから再検索する
            query_for_count = _objectSpread({}, query);

            if (query_for_count.sort) {
              delete query_for_count.sort;
            }

            _context5.next = 4;
            return esClient.count(query_for_count);

          case 4:
            result = _context5.sent;
            query["from"] = 0;
            query["size"] = result.count; //result.hits.total.value;

            _context5.next = 9;
            return esClient.search(query);

          case 9:
            return _context5.abrupt("return", _context5.sent);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function (_x11) {
    return _ref5.apply(this, arguments);
  };
}();

var _default = esClient;
exports["default"] = _default;