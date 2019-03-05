"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reCreateElasticCache = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _mongoose = require("mongoose");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

var _elasticsearchclient = require("../../elasticsearchclient");

var _elasticsearchclient2 = _interopRequireDefault(_elasticsearchclient);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _Tenant = require("../../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _DisplayItem = require("../../models/DisplayItem");

var _DisplayItem2 = _interopRequireDefault(_DisplayItem);

var _MetaInfo = require("../../models/MetaInfo");

var _MetaInfo2 = _interopRequireDefault(_MetaInfo);

var _Action = require("../../models/Action");

var _Action2 = _interopRequireDefault(_Action);

var _File = require("../../models/File");

var _File2 = _interopRequireDefault(_File);

var _Dir = require("../../models/Dir");

var _Dir2 = _interopRequireDefault(_Dir);

var _constants = require("../../configs/constants");

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// logger
var task = function task() {
  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var tenant_name, tenant, tenant_id, type, settings, index, file_properties, meta_infos, actions, mappings, isExists;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (process.argv[3]) {
              _context.next = 3;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 3:
            tenant_name = process.argv[3];
            _context.next = 6;
            return _Tenant2.default.findOne({ "name": tenant_name });

          case 6:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 9;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 " + tenant_name);

          case 9:
            tenant_id = tenant._id.toString();
            type = "files";
            settings = {
              "analysis": {
                "tokenizer": {
                  "kuromoji_search": {
                    "type": "kuromoji_tokenizer",
                    "mode": "search",
                    "discard_punctuation": "false"
                  }
                },
                "analyzer": {
                  "default": {
                    "tokenizer": "kuromoji_search"
                  }
                }
              }
            };


            if (process.env.NODE_ENV === "production") {
              index = { number_of_replicas: 2 };

              settings = (0, _extends3.default)({}, settings, { index: index });
            }

            file_properties = {
              _id: { type: "text" },
              name: {
                type: "text",
                fielddata: true,
                fields: {
                  raw: { type: "keyword" }
                }
              },
              mime_type: { type: "text", index: false },
              size: { type: "long", index: false },
              is_dir: { type: "boolean" },
              dir_id: { type: "keyword" },
              is_display: { type: "boolean" },
              is_star: { type: "boolean" },
              is_trash: { type: "boolean" },
              is_crypted: { type: "boolean", index: false },
              is_deleted: { type: "boolean" },
              modified: {
                type: "date",
                index: true,
                fields: {
                  raw: { type: "keyword" }
                }
              },
              preview_id: { type: "text", index: false },
              authorities: { type: "nested" },
              dirs: { type: "nested" },
              unvisible: { type: "boolean" },
              sort_target: { type: "text", index: false },
              actions: { properties: {} },
              tag: { type: "text" }
            };

            // meta_infoのマッピング

            _context.next = 16;
            return _MetaInfo2.default.find({
              tenant_id: _mongoose.Types.ObjectId(tenant_id)
            });

          case 16:
            meta_infos = _context.sent;


            meta_infos.forEach(function (item, index) {
              file_properties[item._id] = {
                type: item.value_type === "Date" ? "date" : "text",
                "fields": { // sort用のフィールドを持つ
                  "raw": {
                    "type": "keyword"
                  }
                }

              };
            });

            _context.next = 20;
            return _Action2.default.find();

          case 20:
            actions = _context.sent;

            actions.forEach(function (item, index) {
              file_properties["actions"]["properties"][item._id] = {
                "type": "keyword"
              };
            });

            mappings = {
              index: tenant_id,
              type: type,
              body: {
                properties: {
                  file: {
                    properties: file_properties
                  }
                }
              }
            };


            console.log("check old indedices:" + tenant_id);
            _context.next = 26;
            return _elasticsearchclient2.default.indices.exists({ index: tenant_id });

          case 26:
            isExists = _context.sent;

            if (!isExists) {
              _context.next = 31;
              break;
            }

            console.log("delete index: " + tenant_id);
            _context.next = 31;
            return _elasticsearchclient2.default.indices.delete({ index: tenant_id });

          case 31:
            console.log("create index:" + tenant_id);

            _context.next = 34;
            return _elasticsearchclient2.default.indices.create({ index: tenant_id,
              body: {
                settings: settings
              }
            });

          case 34:
            console.log("put mapping");
            _context.next = 37;
            return _elasticsearchclient2.default.indices.putMapping(mappings);

          case 37:
            console.log("done!");

            _context.next = 43;
            break;

          case 40:
            _context.prev = 40;
            _context.t0 = _context["catch"](0);

            console.log(_context.t0);

          case 43:
            _context.prev = 43;

            process.exit();

            return _context.finish(43);

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 40, 43, 46]]);
  }));
};

/**
 * init後に行う
 * @param {*} tenant_id
 */


// models
var reCreateElasticCache = exports.reCreateElasticCache = async function reCreateElasticCache() {
  return (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var tenant_name, tenant, folder_ids, i, folder_id, folder_count, folder, result, file_ids, _i, ids, files;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (process.argv[3]) {
              _context2.next = 3;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 3:
            tenant_name = process.argv[3];
            _context2.next = 6;
            return _Tenant2.default.findOne({ "name": tenant_name });

          case 6:
            tenant = _context2.sent;

            if (!(tenant === null)) {
              _context2.next = 9;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 " + tenant_name);

          case 9:
            _context2.next = 11;
            return _Dir2.default.find({
              ancestor: tenant.home_dir_id,
              descendant: { $nin: [tenant.trash_dir_id] //trashを含まない
              } });

          case 11:
            _context2.t0 = function (folder) {
              return folder.descendant;
            };

            folder_ids = _context2.sent.map(_context2.t0);
            // フォルダのidリストを取得

            console.log('インデックス作成されるフォルダリスト：');
            console.log(folder_ids);
            i = 0;

          case 16:
            if (!(i < folder_ids.length)) {
              _context2.next = 46;
              break;
            }

            folder_id = folder_ids[i];
            _context2.next = 20;
            return _File2.default.find({ _id: folder_id, is_display: true }).count();

          case 20:
            folder_count = _context2.sent;

            if (!(folder_count > 0)) {
              _context2.next = 28;
              break;
            }

            _context2.next = 24;
            return _File2.default.searchFileOne({ _id: folder_id });

          case 24:
            folder = _context2.sent;
            _context2.next = 27;
            return _elasticsearchclient2.default.createIndex(tenant._id.toString(), [folder]);

          case 27:
            result = _context2.sent;

          case 28:
            _context2.next = 30;
            return _File2.default.find({ dir_id: folder_id, is_dir: false, is_display: true });

          case 30:
            _context2.t1 = function (file) {
              return file._id;
            };

            file_ids = _context2.sent.map(_context2.t1);
            _i = 0;

          case 33:
            if (!(_i < file_ids.length)) {
              _context2.next = 43;
              break;
            }

            ids = file_ids.slice(_i, _i + (constants.FILE_LIMITS_PER_PAGE - 1));
            _context2.next = 37;
            return _File2.default.searchFiles({ _id: { $in: ids } }, 0, constants.FILE_LIMITS_PER_PAGE, { _id: "asc" });

          case 37:
            files = _context2.sent;
            _context2.next = 40;
            return _elasticsearchclient2.default.createIndex(tenant._id.toString(), files);

          case 40:
            _i += constants.FILE_LIMITS_PER_PAGE;
            _context2.next = 33;
            break;

          case 43:
            i++;
            _context2.next = 16;
            break;

          case 46:
            _context2.next = 51;
            break;

          case 48:
            _context2.prev = 48;
            _context2.t2 = _context2["catch"](0);

            console.log(_context2.t2);

          case 51:
            _context2.prev = 51;

            process.exit();

            return _context2.finish(51);

          case 54:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 48, 51, 54]]);
  }));
};

exports.default = task;