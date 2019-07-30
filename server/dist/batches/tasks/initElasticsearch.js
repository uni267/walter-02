"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.reCreateElasticCache = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _co = _interopRequireDefault(require("co"));

var _mongoose = require("mongoose");

var _moment = _interopRequireDefault(require("moment"));

var _util = _interopRequireDefault(require("util"));

var _ = _interopRequireWildcard(require("lodash"));

var _elasticsearchclient = _interopRequireDefault(require("../../elasticsearchclient"));

var _logger = _interopRequireDefault(require("../../logger"));

var _Tenant = _interopRequireDefault(require("../../models/Tenant"));

var _DisplayItem = _interopRequireDefault(require("../../models/DisplayItem"));

var _MetaInfo = _interopRequireDefault(require("../../models/MetaInfo"));

var _Action = _interopRequireDefault(require("../../models/Action"));

var _File = _interopRequireDefault(require("../../models/File"));

var _Dir = _interopRequireDefault(require("../../models/Dir"));

var constants = _interopRequireWildcard(require("../../configs/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var task =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenant_name) {
    var tenant, tenant_id, type, settings, index, file_properties, meta_infos, actions, mappings, isExists;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //  co(function* () {
            console.log("init-elasticsearch start.....");
            _context.prev = 1;

            if (tenant_name) {
              _context.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            _context.next = 6;
            return _Tenant["default"].findOne({
              "name": tenant_name
            });

          case 6:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 9;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 ".concat(tenant_name));

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
                  },
                  "full_text_analyzer": {
                    "type": "custom",
                    "tokenizer": "kuromoji_search",
                    "filter": ["ja_stop", "kuromoji_part_of_speech", "kuromoji_number"]
                  }
                }
              }
            };

            if (process.env.NODE_ENV === "production") {
              index = {
                number_of_replicas: 2
              };
              settings = _objectSpread({}, settings, {
                index: index
              });
            }

            file_properties = {
              _id: {
                type: "text"
              },
              name: {
                type: "text",
                fielddata: true,
                fields: {
                  raw: {
                    type: "keyword"
                  }
                }
              },
              mime_type: {
                type: "text",
                index: false
              },
              size: {
                type: "long",
                index: false
              },
              is_dir: {
                type: "boolean"
              },
              dir_id: {
                type: "keyword"
              },
              is_display: {
                type: "boolean"
              },
              is_star: {
                type: "boolean"
              },
              is_trash: {
                type: "boolean"
              },
              is_crypted: {
                type: "boolean",
                index: false
              },
              is_deleted: {
                type: "boolean"
              },
              modified: {
                type: "date",
                index: true,
                fields: {
                  raw: {
                    type: "keyword"
                  }
                }
              },
              preview_id: {
                type: "text",
                index: false
              },
              authorities: {
                type: "nested"
              },
              dirs: {
                type: "nested"
              },
              unvisible: {
                type: "boolean"
              },
              sort_target: {
                type: "text",
                index: false
              },
              actions: {
                properties: {}
              },
              tag: {
                type: "text"
              },
              full_text: {
                type: "text",
                fielddata: true,
                search_analyzer: "full_text_analyzer",
                analyzer: "full_text_analyzer"
              },
              meta_text: {
                type: "text",
                fielddata: true,
                search_analyzer: "full_text_analyzer",
                analyzer: "full_text_analyzer"
              },
              tstExpirationDate: {
                "type": "date"
              },
              tstStatus: {
                "type": "keyword"
              }
            }; // meta_infoのマッピング

            _context.next = 16;
            return _MetaInfo["default"].find({
              tenant_id: _mongoose.Types.ObjectId(tenant_id)
            });

          case 16:
            meta_infos = _context.sent;
            meta_infos.forEach(function (item, index) {
              file_properties[item._id] = {
                type: item.value_type === "Date" ? "date" : "text",
                "fields": {
                  // sort用のフィールドを持つ
                  "raw": {
                    "type": "keyword"
                  }
                }
              };
            });
            _context.next = 20;
            return _Action["default"].find();

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
              include_type_name: true,
              body: {
                properties: {
                  file: {
                    properties: file_properties
                  }
                }
              }
            };
            console.log("check old indedices:".concat(tenant_id));
            _context.next = 26;
            return _elasticsearchclient["default"].indices.exists({
              index: tenant_id
            });

          case 26:
            isExists = _context.sent;

            if (!isExists.body) {
              _context.next = 31;
              break;
            }

            console.log("delete index: ".concat(tenant_id));
            _context.next = 31;
            return _elasticsearchclient["default"].indices["delete"]({
              index: tenant_id
            });

          case 31:
            console.log("create index:".concat(tenant_id));
            _context.next = 34;
            return _elasticsearchclient["default"].indices.create({
              index: tenant_id,
              body: {
                settings: settings
              }
            });

          case 34:
            console.log("put mapping");
            _context.next = 37;
            return _elasticsearchclient["default"].indices.putMapping(mappings);

          case 37:
            console.log("done!");
            _context.next = 40;
            return reCreateElasticCache(tenant_name);

          case 40:
            _context.next = 45;
            break;

          case 42:
            _context.prev = 42;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0);

          case 45:
            _context.prev = 45;
            return _context.finish(45);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 42, 45, 47]]);
  }));

  return function task(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * init後に行う
 * @param {*} tenant_id
 */


var reCreateElasticCache =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(tenant_name) {
    var tenant, folder_ids, i, folder_id, folder_count, folder, result, file_ids, _i, ids, files;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //  co(function* (){
            console.log("recreate-elasticsearch start....");
            _context2.prev = 1;

            if (tenant_name) {
              _context2.next = 4;
              break;
            }

            throw new Error("引数にテナント名を指定する必要があります");

          case 4:
            _context2.next = 6;
            return _Tenant["default"].findOne({
              "name": tenant_name
            });

          case 6:
            tenant = _context2.sent;

            if (!(tenant === null)) {
              _context2.next = 9;
              break;
            }

            throw new Error("\u6307\u5B9A\u3055\u308C\u305F\u30C6\u30CA\u30F3\u30C8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093 ".concat(tenant_name));

          case 9:
            _context2.next = 11;
            return _Dir["default"].find({
              ancestor: tenant.home_dir_id,
              descendant: {
                $nin: [tenant.trash_dir_id] //trashを含まない

              }
            });

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
            return _File["default"].find({
              _id: folder_id,
              is_display: true
            }).countDocuments();

          case 20:
            folder_count = _context2.sent;

            if (!(folder_count > 0)) {
              _context2.next = 28;
              break;
            }

            _context2.next = 24;
            return _File["default"].searchFileOne({
              _id: folder_id
            });

          case 24:
            folder = _context2.sent;
            _context2.next = 27;
            return _elasticsearchclient["default"].createIndex(tenant._id.toString(), [folder]);

          case 27:
            result = _context2.sent;

          case 28:
            _context2.next = 30;
            return _File["default"].find({
              dir_id: folder_id,
              is_dir: false,
              is_display: true
            });

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
            return _File["default"].searchFiles({
              _id: {
                $in: ids
              }
            }, 0, constants.FILE_LIMITS_PER_PAGE, {
              _id: "asc"
            });

          case 37:
            files = _context2.sent;
            _context2.next = 40;
            return _elasticsearchclient["default"].createIndex(tenant._id.toString(), files);

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
            _context2.t2 = _context2["catch"](1);
            console.log(_context2.t2);

          case 51:
            _context2.prev = 51;
            return _context2.finish(51);

          case 53:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 48, 51, 53]]);
  }));

  return function reCreateElasticCache(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.reCreateElasticCache = reCreateElasticCache;
var _default = task;
exports["default"] = _default;