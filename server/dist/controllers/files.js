"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractFileActions = exports.checkFilePermission = exports.isAllowedFileId = exports.getAllowedFileIds = exports.toggleUnvisible = exports.exists = exports.previewExists = exports.deleteFilePhysical = exports.deleteFileLogical = exports.restore = exports.moveTrash = exports.removeAuthority = exports.addAuthority = exports.toggleStar = exports.removeMeta = exports.addMeta = exports.removeTag = exports.addTag = exports.upload = exports.move = exports.rename = exports.searchDetail = exports.searchItems = exports.search = exports.download = exports.view = exports.index = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _multer = _interopRequireDefault(require("multer"));

var _moment = _interopRequireDefault(require("moment"));

var _child_process = require("child_process");

var _util = _interopRequireDefault(require("util"));

var _crypto = _interopRequireDefault(require("crypto"));

var _elasticsearchclient = _interopRequireDefault(require("../elasticsearchclient"));

var _index = require("../kafkaclient/index");

var _ = _interopRequireWildcard(require("lodash"));

var _logger = _interopRequireDefault(require("../logger"));

var commons = _interopRequireWildcard(require("./commons"));

var _AppError = require("../errors/AppError");

var _tsaClient = _interopRequireDefault(require("../apis/tsaClient"));

var _server = require("../configs/server");

var constants = _interopRequireWildcard(require("../configs/constants"));

var _Dir = _interopRequireDefault(require("../models/Dir"));

var _File = _interopRequireDefault(require("../models/File"));

var _Preview = _interopRequireDefault(require("../models/Preview"));

var _Tag = _interopRequireDefault(require("../models/Tag"));

var _MetaInfo = _interopRequireDefault(require("../models/MetaInfo"));

var _User = _interopRequireDefault(require("../models/User"));

var _Group = _interopRequireDefault(require("../models/Group"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _RoleFile = _interopRequireDefault(require("../models/RoleFile"));

var _AuthorityFile = _interopRequireDefault(require("../models/AuthorityFile"));

var _Action = _interopRequireDefault(require("../models/Action"));

var _FileMetaInfo = _interopRequireDefault(require("../models/FileMetaInfo"));

var _DisplayItem = _interopRequireDefault(require("../models/DisplayItem"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var _Swift = require("../storages/Swift");

var _dirs = require("./dirs");

var _timestamps = require("./timestamps");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * ファイル一覧
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} export_excel 
 * @param {*} no_limit 
 */
var index =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var export_excel,
        no_limit,
        _req$query,
        dir_id,
        page,
        sort,
        order,
        is_display_unvisible,
        tenant_id,
        _dir,
        sortOption,
        action_id,
        isDisplayUnvisible,
        isDisplayUnvisibleCondition,
        authorityConditions,
        esQuery,
        offset,
        esResult,
        esCount,
        query_for_count,
        total,
        esResultIds,
        conditions,
        limit,
        files,
        errors,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            export_excel = _args.length > 3 && _args[3] !== undefined ? _args[3] : false;
            no_limit = _args.length > 4 && _args[4] !== undefined ? _args[4] : false;
            _context.prev = 2;
            _req$query = req.query, dir_id = _req$query.dir_id, page = _req$query.page, sort = _req$query.sort, order = _req$query.order, is_display_unvisible = _req$query.is_display_unvisible;
            tenant_id = res.user.tenant_id; // デフォルトはテナントのホーム

            if (dir_id === null || dir_id === undefined || dir_id === "") {
              dir_id = res.user.tenant.home_dir_id;
            }

            if (_mongoose["default"].Types.ObjectId.isValid(dir_id)) {
              _context.next = 8;
              break;
            }

            throw new _AppError.ValidationError("dir_id is not valid");

          case 8:
            _context.next = 10;
            return _File["default"].findById(dir_id);

          case 10:
            _dir = _context.sent;

            if (!(_dir === null)) {
              _context.next = 13;
              break;
            }

            throw new _AppError.RecordNotFoundException("dir is not found");

          case 13:
            _context.next = 15;
            return isAllowedFileId(dir_id, res.user._id, constants.PERMISSION_VIEW_LIST);

          case 15:
            if (_context.sent) {
              _context.next = 17;
              break;
            }

            throw new _AppError.PermisstionDeniedException("permission denied");

          case 17:
            if (!(typeof order === "string" && order !== "asc" && order !== "desc")) {
              _context.next = 19;
              break;
            }

            throw new _AppError.ValidationError("sort is empty");

          case 19:
            _context.next = 21;
            return createSortOption(sort, order);

          case 21:
            sortOption = _context.sent;
            // pagination
            if (page === undefined || page === null) page = 0;

            if (!(page === "" || (0, _.isNaN)(parseInt(page)))) {
              _context.next = 25;
              break;
            }

            throw new _AppError.ValidationError("page is not number");

          case 25:
            _context.next = 27;
            return _Action["default"].findOne({
              name: constants.PERMISSION_VIEW_LIST
            });

          case 27:
            action_id = _context.sent._id;
            // 一覧表示のアクションID
            // デフォルト表示させたくないファイル
            isDisplayUnvisible = is_display_unvisible === "true";
            isDisplayUnvisibleCondition = isDisplayUnvisible ? {} : {
              "match": {
                "file.unvisible": false
              }
            }; // user_id or group_idで権限があるファイルを取得する

            authorityConditions = [{
              match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                query: res.user._id
              })
            }];

            if (res.user.groups.length > 0) {
              authorityConditions = authorityConditions.concat(res.user.groups.map(function (group_id) {
                return {
                  match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                    query: group_id
                  })
                };
              }));
            }

            esQuery = {
              index: tenant_id.toString(),
              type: "files",
              sort: ["file.is_dir:desc", sort === undefined ? "_score" : "file.".concat(sort, ".raw:").concat(order)],
              body: {
                query: {
                  bool: {
                    must: [{
                      match: {
                        "file.dir_id": {
                          "query": dir_id,
                          "operator": "and"
                        }
                      }
                    }, {
                      match: {
                        "file.is_display": true
                      }
                    }, {
                      match: {
                        "file.is_deleted": false
                      }
                    }, {
                      bool: {
                        should: authorityConditions
                      }
                    }, isDisplayUnvisibleCondition]
                  }
                }
              }
            };
            offset = page * constants.FILE_LIMITS_PER_PAGE;
            query_for_count = _objectSpread({}, esQuery);

            if (query_for_count.sort) {
              delete query_for_count.sort;
            }

            delete query_for_count.body.highlight;
            _context.next = 39;
            return _elasticsearchclient["default"].count(query_for_count);

          case 39:
            esCount = _context.sent;

            if (export_excel) {
              _context.next = 48;
              break;
            }

            esQuery["from"] = offset;
            esQuery["size"] = parseInt(offset) + 30;
            _context.next = 45;
            return _elasticsearchclient["default"].search(esQuery);

          case 45:
            esResult = _context.sent;
            _context.next = 51;
            break;

          case 48:
            _context.next = 50;
            return _elasticsearchclient["default"].searchAll(esQuery);

          case 50:
            esResult = _context.sent;

          case 51:
            total = esCount.body.count;
            esResultIds = esResult.body.hits.hits.map(function (hit) {
              return _mongoose["default"].Types.ObjectId(hit._id);
            });
            conditions = {
              is_display: true,
              is_deleted: false,
              $and: [{
                _id: {
                  $in: esResultIds
                }
              }]
            };
            limit = export_excel && total !== 0 ? total : constants.FILE_LIMITS_PER_PAGE;

            if (!_mongoose["default"].Types.ObjectId.isValid(sort)) {
              _context.next = 61;
              break;
            }

            _context.next = 58;
            return _File["default"].searchFiles(conditions, 0, limit, sortOption, _mongoose["default"].Types.ObjectId(sort));

          case 58:
            files = _context.sent;
            _context.next = 64;
            break;

          case 61:
            _context.next = 63;
            return _File["default"].searchFiles(conditions, 0, limit, sortOption);

          case 63:
            files = _context.sent;

          case 64:
            files = files.map(function (file) {
              file.actions = extractFileActions(file.authorities, res.user);
              return file;
            });

            if (!export_excel) {
              _context.next = 70;
              break;
            }

            files = files.map(function (file) {
              var route = file.dirs.filter(function (dir) {
                return dir.ancestor.is_display;
              }).map(function (dir) {
                return dir.ancestor.name;
              });
              file.dir_route = route.length > 0 ? route.reverse().join("/") : "";
              return file;
            });
            return _context.abrupt("return", files);

          case 70:
            res.json({
              status: {
                success: true,
                total: total
              },
              body: files
            });

          case 71:
            _context.next = 92;
            break;

          case 73:
            _context.prev = 73;
            _context.t0 = _context["catch"](2);
            errors = {};
            _context.t1 = _context.t0.message;
            _context.next = _context.t1 === "dir_id is not valid" ? 79 : _context.t1 === "dir is not found" ? 79 : _context.t1 === "dir_id is empty" ? 81 : _context.t1 === "permission denied" ? 83 : _context.t1 === "page is not number" ? 85 : _context.t1 === "sort is empty" ? 87 : 89;
            break;

          case 79:
            errors.dir_id = "指定されたフォルダが存在しないためファイル一覧の取得に失敗しました";
            return _context.abrupt("break", 90);

          case 81:
            errors.dir_id = "dir_id is empty";
            return _context.abrupt("break", 90);

          case 83:
            errors.dir_id = "閲覧権限が無いためファイル一覧の取得に失敗しました";
            return _context.abrupt("break", 90);

          case 85:
            errors.page = "pageが数字では無いためファイル一覧の取得に失敗しました";
            return _context.abrupt("break", 90);

          case 87:
            errors.sort = "ソート条件が不正なためファイル一覧の取得に失敗しました";
            return _context.abrupt("break", 90);

          case 89:
            errors.unknown = _context.t0;

          case 90:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイル一覧の取得に失敗しました",
                errors: errors
              }
            });

          case 92:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 73]]);
  }));

  return function index(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * ファイル詳細
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.index = index;

var view =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res, next) {
    var file_id, file, tags, actions, route, response_body, tenant_id, es_file;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context2.next = 4;
              break;
            }

            throw new _AppError.ValidationError("file_idが空です");

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context2.next = 6;
              break;
            }

            throw new _AppError.ValidationError("ファイルIDが不正なためファイルの取得に失敗しました");

          case 6:
            _context2.next = 8;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 8:
            file = _context2.sent;
            _context2.next = 11;
            return isAllowedFileId(file_id, res.user._id, constants.PERMISSION_VIEW_DETAIL);

          case 11:
            if (_context2.sent) {
              _context2.next = 13;
              break;
            }

            throw new _AppError.PermisstionDeniedException("指定されたファイルが見つかりません");

          case 13:
            if (!(file === null || file === "" || file === undefined)) {
              _context2.next = 15;
              break;
            }

            throw new _AppError.RecordNotFoundException("指定されたファイルが見つかりません");

          case 15:
            if (!file.is_deleted) {
              _context2.next = 17;
              break;
            }

            throw new _AppError.RecordNotFoundException("ファイルは既に削除されているためファイルの取得に失敗しました");

          case 17:
            _context2.next = 19;
            return _Tag["default"].find({
              _id: {
                $in: file.tags
              }
            });

          case 19:
            tags = _context2.sent;
            actions = extractFileActions(file.authorities, res.user);
            route = file.dirs.filter(function (dir) {
              return dir.ancestor.is_display;
            }).map(function (dir) {
              return dir.ancestor.name;
            });
            file.dir_route = route.length > 0 ? route.reverse().join("/") : "";
            response_body = _objectSpread({}, file, {
              tags: tags,
              actions: actions
            });
            tenant_id = res.user.tenant_id;
            _context2.next = 27;
            return _elasticsearchclient["default"].getFile(tenant_id.toString(), file_id);

          case 27:
            es_file = _context2.sent;

            if (es_file !== null || es_file !== undefined) {
              response_body = _objectSpread({}, response_body, {
                full_text: es_file.full_text,
                meta_text: es_file.meta_text
              });
            }

            res.json({
              status: {
                success: true
              },
              body: response_body
            });
            _context2.next = 36;
            break;

          case 32:
            _context2.prev = 32;
            _context2.t0 = _context2["catch"](0);

            _logger["default"].error(_context2.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイルの取得に失敗しました",
                errors: _context2.t0
              }
            });

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 32]]);
  }));

  return function view(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * ファイルダウンロード
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.view = view;

var download =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var file_id, fileRecord, tenant_name, swift, readStream, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            file_id = req.query.file_id;

            if (!(file_id === null || file_id === undefined || file_id === "")) {
              _context3.next = 4;
              break;
            }

            throw new _AppError.ValidationError("file_id is empty");

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context3.next = 6;
              break;
            }

            throw new _AppError.ValidationError("file_id is invalid");

          case 6:
            _context3.next = 8;
            return _File["default"].findById(file_id);

          case 8:
            fileRecord = _context3.sent;

            if (!(fileRecord === null)) {
              _context3.next = 11;
              break;
            }

            throw new _AppError.ValidationError("file is empty");

          case 11:
            if (!fileRecord.is_deleted) {
              _context3.next = 13;
              break;
            }

            throw new _AppError.ValidationError("file is deleted");

          case 13:
            tenant_name = res.user.tenant.name;
            swift = new _Swift.Swift();
            _context3.next = 17;
            return swift.downloadFile(tenant_name, fileRecord);

          case 17:
            readStream = _context3.sent;
            readStream.on("data", function (data) {
              return res.write(data);
            });
            readStream.on("end", function () {
              return res.end();
            });
            _context3.next = 37;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](0);
            errors = {};
            _context3.t1 = _context3.t0.message;
            _context3.next = _context3.t1 === "file_id is empty" ? 28 : _context3.t1 === "file_id is invalid" ? 30 : _context3.t1 === "file is empty" ? 32 : 34;
            break;

          case 28:
            errors.file_id = "ファイルIDが空のためファイルのダウンロードに失敗しました";
            return _context3.abrupt("break", 35);

          case 30:
            errors.file_id = "ファイルIDが不正のためファイルのダウンロードに失敗しました";
            return _context3.abrupt("break", 35);

          case 32:
            errors.file_id = "指定されたファイルが存在しないためファイルのダウンロードに失敗しました";
            return _context3.abrupt("break", 35);

          case 34:
            errors.unknown = _context3.t0;

          case 35:
            _logger["default"].error(_context3.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイルのダウンロードに失敗しました",
                errors: errors
              }
            });

          case 37:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 22]]);
  }));

  return function download(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * 簡易検索
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} export_excel 
 */


exports.download = download;

var search =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res, next) {
    var export_excel,
        _req$query2,
        q,
        page,
        sort,
        order,
        is_display_unvisible,
        tenant_id,
        _ref5,
        trash_dir_id,
        _page,
        action_id,
        isDisplayUnvisible,
        isDisplayUnvisibleCondition,
        authorityConditions,
        esQueryDir,
        esResultDir,
        authorizedDirIds,
        searchFields,
        esQuery,
        offset,
        esResult,
        esCount,
        query_for_count,
        total,
        esResultIds,
        conditions,
        limit,
        _sort,
        files,
        errors,
        _args5 = arguments;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            export_excel = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
            _context5.prev = 1;
            _req$query2 = req.query, q = _req$query2.q, page = _req$query2.page, sort = _req$query2.sort, order = _req$query2.order, is_display_unvisible = _req$query2.is_display_unvisible;
            tenant_id = res.user.tenant_id;

            if (!(q === undefined || q === null || q === "")) {
              _context5.next = 6;
              break;
            }

            throw new _AppError.ValidationError("q is empty");

          case 6:
            _context5.next = 8;
            return _Tenant["default"].findOne(tenant_id);

          case 8:
            _ref5 = _context5.sent;
            trash_dir_id = _ref5.trash_dir_id;
            _page = page === undefined || page === null ? 0 : page;

            if (!(_page === "" || (0, _.isNaN)(parseInt(_page)))) {
              _context5.next = 13;
              break;
            }

            throw new _AppError.ValidationError("page is not number");

          case 13:
            _context5.next = 15;
            return _Action["default"].findOne({
              name: constants.PERMISSION_VIEW_LIST
            });

          case 15:
            action_id = _context5.sent._id;
            // 一覧表示のアクションID
            isDisplayUnvisible = is_display_unvisible === "true";
            isDisplayUnvisibleCondition = isDisplayUnvisible ? {} : {
              "match": {
                "file.unvisible": false
              }
            }; // user_id or group_idで権限があるファイルを取得する

            authorityConditions = [{
              match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                query: res.user._id
              })
            }];

            if (res.user.groups.length > 0) {
              authorityConditions = authorityConditions.concat(res.user.groups.map(function (group_id) {
                return {
                  match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                    query: group_id
                  })
                };
              }));
            } // 閲覧できるフォルダの一覧を取得する


            esQueryDir = {
              index: tenant_id.toString(),
              type: "files",
              body: {
                query: {
                  bool: {
                    must_not: [{
                      match: {
                        "file.dir_id": {
                          // ゴミ箱内のファイルは対象外
                          query: trash_dir_id.toString(),
                          operator: "and"
                        }
                      }
                    }],
                    must: [{
                      "match": {
                        "file.is_dir": true
                      }
                    }, {
                      bool: {
                        should: authorityConditions
                      }
                    }, isDisplayUnvisibleCondition]
                  }
                }
              }
            };
            _context5.next = 23;
            return _elasticsearchclient["default"].searchAll(esQueryDir);

          case 23:
            esResultDir = _context5.sent;
            //esQueryDir["size"] = esResultDir.hits.total;
            //esResultDir = await esClient.search(esQueryDir);      
            // 取得した一覧とTopが閲覧可能なフォルダとなる
            authorizedDirIds = [].concat((0, _toConsumableArray2["default"])(esResultDir.body.hits.hits.map(function (file) {
              return file._id;
            })), [res.user.tenant.home_dir_id.toString()]); // 検索対象のフィールドを取得する

            _context5.next = 27;
            return _DisplayItem["default"].aggregate([{
              $match: {
                is_search: true
              }
            }, {
              $lookup: {
                from: "meta_infos",
                localField: "meta_info_id",
                foreignField: "_id",
                as: "meta_info"
              }
            }, {
              $unwind: {
                path: "$meta_info",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $match: {
                $or: [{
                  "search_value_type": 'String'
                }, {
                  "meta_info.value_type": "String"
                }]
              }
            }]);

          case 27:
            _context5.t0 = function (item) {
              return item.meta_info_id !== null ? "file.".concat(item.meta_info_id.toString()) : "file.".concat(item.name);
            };

            searchFields = _context5.sent.map(_context5.t0);
            esQuery = {
              index: tenant_id.toString(),
              type: "files",
              sort: ["file.is_dir:desc", sort === undefined ? "_score" : "file.".concat(sort, ".raw:").concat(order), "file.name:".concat(order)],
              body: {
                query: {
                  bool: {
                    must_not: [{
                      match: {
                        "file.dir_id": {
                          // ゴミ箱内のファイルは対象外
                          query: trash_dir_id.toString(),
                          "operator": "and"
                        }
                      }
                    }],
                    must: [{
                      query_string: {
                        query: escapeRegExp(q.toString().replace(/[　]/g, ' ')).split(" ").map(function (s) {
                          return "\"".concat(s, "\"");
                        }).join(" "),
                        default_operator: "AND",
                        fields: [].concat((0, _toConsumableArray2["default"])(searchFields), ["file.full_text"])
                      }
                    }, {
                      match: {
                        "file.is_display": true
                      }
                    }, {
                      match: {
                        "file.is_deleted": false
                      }
                    }, {
                      match: {
                        "file.is_trash": false
                      }
                    }, isDisplayUnvisibleCondition, {
                      terms: {
                        "file.dir_id": authorizedDirIds
                      }
                    }, {
                      bool: {
                        should: authorityConditions
                      }
                    }]
                  }
                },
                "highlight": {
                  "fields": {
                    "file.full_text": {
                      "pre_tags": "<b>",
                      "post_tags": "</b>"
                    }
                  }
                }
              }
            };
            offset = _page * constants.FILE_LIMITS_PER_PAGE;
            query_for_count = _objectSpread({}, esQuery);

            if (query_for_count.sort) {
              delete query_for_count.sort;
            }

            delete query_for_count.body.highlight;
            _context5.next = 36;
            return _elasticsearchclient["default"].count(query_for_count);

          case 36:
            esCount = _context5.sent;

            if (export_excel) {
              _context5.next = 45;
              break;
            }

            esQuery["from"] = offset;
            esQuery["size"] = parseInt(offset) + 30;
            _context5.next = 42;
            return _elasticsearchclient["default"].search(esQuery);

          case 42:
            esResult = _context5.sent;
            _context5.next = 48;
            break;

          case 45:
            _context5.next = 47;
            return _elasticsearchclient["default"].searchAll(esQuery);

          case 47:
            esResult = _context5.sent;

          case 48:
            total = esCount.body.count;
            esResultIds = esResult.body.hits.hits.map(function (hit) {
              return _mongoose["default"].Types.ObjectId(hit._id);
            });
            conditions = {
              dir_id: {
                $ne: trash_dir_id
              },
              is_display: true,
              is_deleted: false,
              $and: [{
                _id: {
                  $in: esResultIds
                }
              }]
            };
            limit = export_excel && total !== 0 ? total : constants.FILE_LIMITS_PER_PAGE; // if ( typeof sort === "string" && !mongoose.Types.ObjectId.isValid(sort)  ) throw new ValidationError("sort is empty");

            if (!(typeof order === "string" && order !== "asc" && order !== "desc")) {
              _context5.next = 54;
              break;
            }

            throw new _AppError.ValidationError("sort is empty");

          case 54:
            _context5.next = 56;
            return createSortOption(sort, order);

          case 56:
            _sort = _context5.sent;

            if (!_mongoose["default"].Types.ObjectId.isValid(sort)) {
              _context5.next = 63;
              break;
            }

            _context5.next = 60;
            return _File["default"].searchFiles(conditions, 0, limit, _sort, _mongoose["default"].Types.ObjectId(sort));

          case 60:
            files = _context5.sent;
            _context5.next = 66;
            break;

          case 63:
            _context5.next = 65;
            return _File["default"].searchFiles(conditions, 0, limit, _sort);

          case 65:
            files = _context5.sent;

          case 66:
            _context5.next = 68;
            return Promise.all(files.map(
            /*#__PURE__*/
            function () {
              var _ref6 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee4(file) {
                var route, es_file, hits;
                return _regenerator["default"].wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        route = file.dirs.filter(function (dir) {
                          return dir.ancestor.is_display;
                        }).map(function (dir) {
                          return dir.ancestor.name;
                        });
                        file.dir_route = route.length > 0 ? route.reverse().join("/") : "";
                        file.actions = extractFileActions(file.authorities, res.user); // file.actions = chain(file.authorities) quz:ここを消しても大丈夫？
                        //   .filter( auth => {
                        //     return (auth.users !== undefined && auth.users._id.toString() === res.user._id.toString())
                        //       || (auth.groups !== undefined && res.user.groups.filter(g => g.toString() === auth.groups._id.toString()).length > 0 );
                        //   })
                        //   .map( auth => auth.actions )
                        //   .flattenDeep()
                        //   .uniq();

                        _context4.next = 5;
                        return _elasticsearchclient["default"].getFile(tenant_id.toString(), file._id);

                      case 5:
                        es_file = _context4.sent;

                        if (es_file !== null && es_file !== undefined) {
                          file.full_text = es_file.full_text;
                          file.meta_text = es_file.meta_text;
                          file.search_result = '';
                          hits = esResult.body.hits.hits.filter(function (hit) {
                            return hit._id === file._id.toString();
                          });

                          if (hits.length > 0) {
                            file.search_result = hits[0].highlight && hits[0].highlight['file.full_text'][0] || '';
                          }
                        }

                        return _context4.abrupt("return", file);

                      case 8:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x13) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 68:
            files = _context5.sent;

            if (!export_excel) {
              _context5.next = 73;
              break;
            }

            return _context5.abrupt("return", files);

          case 73:
            res.json({
              status: {
                success: true,
                total: total
              },
              body: files
            });

          case 74:
            _context5.next = 91;
            break;

          case 76:
            _context5.prev = 76;
            _context5.t1 = _context5["catch"](1);
            errors = {};
            _context5.t2 = _context5.t1.message;
            _context5.next = _context5.t2 === "q is empty" ? 82 : _context5.t2 === "page is not number" ? 84 : _context5.t2 === "sort is empty" ? 86 : 88;
            break;

          case 82:
            errors.q = "検索文字列が空のためファイル一覧の取得に失敗しました";
            return _context5.abrupt("break", 89);

          case 84:
            errors.page = "pageが数字ではないためファイル一覧の取得に失敗しました";
            return _context5.abrupt("break", 89);

          case 86:
            errors.sort = "ソート条件が不正なためファイル一覧の取得に失敗しました";
            return _context5.abrupt("break", 89);

          case 88:
            errors.unknown = _context5.t1;

          case 89:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイル一覧の取得に失敗しました",
                errors: errors
              },
              body: []
            });

          case 91:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[1, 76]]);
  }));

  return function search(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * ファイル詳細検索項目一覧
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.search = search;

var searchItems =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res, next) {
    var tenant_id, meta_only, conditions, items, metaInfos, displayItems, errors;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            tenant_id = res.user.tenant_id;

            if (!(tenant_id === undefined || tenant_id === null || tenant_id === "")) {
              _context6.next = 4;
              break;
            }

            throw new _AppError.ValidationError("tenant_id is empty");

          case 4:
            meta_only = req.query.meta_only;

            if (meta_only === undefined || meta_only === null || meta_only === "") {
              meta_only = false;
            }

            if (meta_only === "true" || meta_only === "false" || meta_only === true || meta_only === false) {
              _context6.next = 8;
              break;
            }

            throw new _AppError.ValidationError("meta_only is not boolean");

          case 8:
            conditions = {
              tenant_id: _mongoose["default"].Types.ObjectId(tenant_id)
            };

            if (!(meta_only === "true")) {
              _context6.next = 15;
              break;
            }

            _context6.next = 12;
            return _MetaInfo["default"].find(conditions);

          case 12:
            items = _context6.sent;
            _context6.next = 23;
            break;

          case 15:
            _context6.next = 17;
            return _MetaInfo["default"].find(conditions);

          case 17:
            _context6.t0 = function (meta) {
              meta = meta.toObject();
              meta.meta_info_id = meta._id;
              return meta;
            };

            metaInfos = _context6.sent.map(_context6.t0);
            _context6.next = 21;
            return _DisplayItem["default"].find(_objectSpread({}, conditions, {
              // meta_info_id: null,
              name: {
                $nin: ["file_checkbox", "action"]
              }
            }));

          case 21:
            displayItems = _context6.sent;
            items = displayItems.map(function (displayItem) {
              var idx = (0, _.findIndex)(metaInfos, {
                _id: displayItem.meta_info_id
              });

              if (idx >= 0) {
                var _ref8;

                var displayItemObject = displayItem.toObject();
                return _ref8 = {
                  _id: metaInfos[idx]._id,
                  tenant_id: metaInfos[idx].tenant_id,
                  meta_info_id: metaInfos[idx].meta_info_id,
                  label: metaInfos[idx].label,
                  name: metaInfos[idx].name,
                  value_type: metaInfos[idx].value_type
                }, (0, _defineProperty2["default"])(_ref8, "meta_info_id", metaInfos[idx].meta_info_id), (0, _defineProperty2["default"])(_ref8, "is_display", displayItemObject.is_display), (0, _defineProperty2["default"])(_ref8, "is_excel", displayItemObject.is_excel), (0, _defineProperty2["default"])(_ref8, "is_search", displayItemObject.is_search), (0, _defineProperty2["default"])(_ref8, "width", displayItemObject.width), (0, _defineProperty2["default"])(_ref8, "order", displayItemObject.order), (0, _defineProperty2["default"])(_ref8, "between", displayItemObject.between), _ref8;
              } else {
                return displayItem;
              }
            });

          case 23:
            res.json({
              status: {
                success: true,
                message: "正常に取得が完了"
              },
              body: items
            });
            _context6.next = 37;
            break;

          case 26:
            _context6.prev = 26;
            _context6.t1 = _context6["catch"](0);
            errors = {};
            _context6.t2 = _context6.t1.message;
            _context6.next = _context6.t2 === "meta_only is not boolean" ? 32 : 34;
            break;

          case 32:
            errors.meta_only = "指定したオプションが真偽値以外のため検索項目の取得に失敗しました";
            return _context6.abrupt("break", 36);

          case 34:
            errors.unknown = commons.errorParser(_context6.t1);
            return _context6.abrupt("break", 36);

          case 36:
            res.status(400).json({
              status: {
                success: false,
                message: "検索項目の取得に失敗しました",
                errors: errors
              }
            });

          case 37:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 26]]);
  }));

  return function searchItems(_x14, _x15, _x16) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * ファイル詳細検索
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} export_excel 
 */


exports.searchItems = searchItems;

var searchDetail =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(req, res, next) {
    var export_excel,
        _req$body,
        queries,
        page,
        sort,
        order,
        is_display_unvisible,
        _page,
        tenant_id,
        _ref10,
        trash_dir_id,
        action,
        isDisplayUnvisible,
        isDisplayUnvisibleCondition,
        action_id,
        authorityConditions,
        esQueryDir,
        esResultDir,
        authorizedDirIds,
        esQueryMustsBase,
        _queries,
        must,
        esQuery,
        offset,
        esResult,
        esCount,
        query_for_count,
        total,
        esResultIds,
        conditions,
        limit,
        _sort,
        files,
        errors,
        _args8 = arguments;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            export_excel = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : false;
            _context8.prev = 1;
            _req$body = req.body, queries = _req$body.queries, page = _req$body.page, sort = _req$body.sort, order = _req$body.order, is_display_unvisible = _req$body.is_display_unvisible;
            _page = page === undefined || page === null ? 0 : page;

            if (!(_page === "" || (0, _.isNaN)(parseInt(_page)))) {
              _context8.next = 6;
              break;
            }

            throw new _AppError.ValidationError("page is not number");

          case 6:
            tenant_id = res.user.tenant_id;
            _context8.next = 9;
            return _Tenant["default"].findById(tenant_id);

          case 9:
            _ref10 = _context8.sent;
            trash_dir_id = _ref10.trash_dir_id;
            _context8.next = 13;
            return _Action["default"].findOne({
              name: constants.PERMISSION_VIEW_LIST
            });

          case 13:
            action = _context8.sent;
            isDisplayUnvisible = is_display_unvisible === "true";
            isDisplayUnvisibleCondition = isDisplayUnvisible ? {} : {
              "match": {
                "file.unvisible": false
              }
            };
            _context8.next = 18;
            return _Action["default"].findOne({
              name: constants.PERMISSION_VIEW_LIST
            });

          case 18:
            action_id = _context8.sent._id;
            // 一覧表示のアクションID
            // user_id or group_idで権限があるファイルを取得する
            authorityConditions = [{
              match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                query: res.user._id
              })
            }];

            if (res.user.groups.length > 0) {
              authorityConditions = authorityConditions.concat(res.user.groups.map(function (group_id) {
                return {
                  match: (0, _defineProperty2["default"])({}, "file.actions.".concat(action_id), {
                    query: group_id
                  })
                };
              }));
            }

            esQueryDir = {
              index: tenant_id.toString(),
              type: "files",
              body: {
                query: {
                  bool: {
                    must_not: [{
                      match: {
                        "file.dir_id": {
                          query: trash_dir_id.toString(),
                          operator: "and"
                        }
                      }
                    }],
                    must: [// {
                    //   match: {
                    //     [`file.actions.${action._id}`]: {
                    //       query: res.user._id,
                    //       operator: "and"
                    //     }
                    //   }
                    // },
                    {
                      match: {
                        "file.is_dir": true
                      }
                    }, {
                      match: {
                        "file.is_deleted": false
                      }
                    }, {
                      bool: {
                        should: authorityConditions
                      }
                    }, isDisplayUnvisibleCondition]
                  }
                }
              }
            };
            _context8.next = 24;
            return _elasticsearchclient["default"].searchAll(esQueryDir);

          case 24:
            esResultDir = _context8.sent;
            // esQueryDir["size"] = esResultDir.hits.total;
            // esResultDir = await esClient.search(esQueryDir);      
            // 取得した一覧とTopが閲覧可能なフォルダとなる
            authorizedDirIds = [].concat((0, _toConsumableArray2["default"])(esResultDir.body.hits.hits.map(function (file) {
              return file._id;
            })), [res.user.tenant.home_dir_id.toString()]);
            esQueryMustsBase = [// {
            //   match: {
            //     [`file.actions.${action._id}`]: {
            //       query: res.user._id,
            //       operator: "and"
            //     }
            //   }
            // }, 
            {
              match: {
                "file.is_display": true
              }
            }, {
              match: {
                "file.is_deleted": false
              }
            }, {
              match: {
                "file.is_trash": false
              }
            }, isDisplayUnvisibleCondition, {
              terms: {
                "file.dir_id": authorizedDirIds
              }
            }, {
              bool: {
                should: authorityConditions
              }
            }];
            _context8.next = 29;
            return queries.map(function (q) {
              // メタ情報、文字列
              if (q.meta_info_id && q.value_type === "String") {
                return {
                  query_string: {
                    query: escapeRegExp(q.value.toString().replace(/[　]/g, ' ')).split(" ").map(function (s) {
                      return "\"".concat(s, "\"");
                    }).join(" "),
                    default_operator: "AND",
                    fields: ["file.".concat(q.meta_info_id)]
                  }
                };
              } // メタ情報、日付、between
              else if (q.meta_info_id && q.value_type === "Date" && q.between) {
                  var between = {};

                  if (q.value.gt !== undefined && q.value.gt !== null && q.value.gt !== "") {
                    between.gte = (0, _moment["default"])(q.value.gt).utc();
                  } else {
                    between.gte = null;
                  }

                  if (q.value.lt !== undefined && q.value.gt !== null && q.value.gt !== "") {
                    between.lte = (0, _moment["default"])(q.value.lt).add(1, "days").utc();
                  } else {
                    between.lte = null;
                  }

                  return {
                    range: (0, _defineProperty2["default"])({}, "file.".concat(q.meta_info_id), between)
                  };
                } // フォルダパス(場所)


              if (q.name === "dir_route") {
                var dirQuery = {
                  name: {
                    $regex: escapeRegExp(q.value)
                  },
                  is_dir: true
                };
                return _File["default"].findOne(dirQuery).then(function (dir) {
                  return dir ? {
                    match: {
                      "file.dir_id": dir._id
                    }
                  } : {
                    match: {
                      "file.dir_id": ""
                    }
                  };
                });
              } // 更新日時などメタ情報以外の日付範囲
              // @todo elasticsearchでindex化されていない


              if (q.value_type === "Date" && q.between) {
                var _between = {};

                if (q.value.gt !== undefined && q.value.gt !== null && q.value.gt !== "") {
                  _between.gte = (0, _moment["default"])(q.value.gt).utc();
                } else {
                  _between.gte = null;
                }

                if (q.value.lt !== undefined && q.value.gt !== null && q.value.gt !== "") {
                  _between.lte = (0, _moment["default"])(q.value.lt).add(1, "days").utc();
                } else {
                  _between.lte = null;
                }

                return {
                  range: (0, _defineProperty2["default"])({}, "file.".concat(q.name), _between)
                };
              } // タイムスタンプ処理


              if (q.name === "timestamp") {
                switch (q.value) {
                  case "valid_timestamp":
                    return {
                      bool: {
                        must: [{
                          match: {
                            "file.tstStatus": "Success"
                          }
                        }, {
                          range: {
                            "file.tstExpirationDate": {
                              "gte": "now+1y/d"
                            }
                          }
                        }]
                      }
                    };

                  case "expire_soon":
                    return {
                      bool: {
                        must: [{
                          match: {
                            "file.tstStatus": "Success"
                          }
                        }, {
                          range: {
                            "file.tstExpirationDate": {
                              "gte": "now/d",
                              "lt": "now+1y/d"
                            }
                          }
                        }]
                      }
                    };

                  case "invalid_timestamp":
                  default:
                    return {
                      match: {
                        "file.tstStatus": "Failed"
                      }
                    };
                }
              } // タグ @todo elasticsearchにindex化されていない
              // メタ情報以外の文字列


              return {
                query_string: {
                  query: escapeRegExp(q.value.toString().replace(/[　]/g, ' ')).split(" ").map(function (s) {
                    return "\"".concat(s, "\"");
                  }).join(" "),
                  default_operator: "AND",
                  fields: ["file.".concat(q.name)]
                }
              };
            });

          case 29:
            _queries = _context8.sent;
            must = [].concat(esQueryMustsBase, (0, _toConsumableArray2["default"])(_queries));
            esQuery = {
              index: tenant_id.toString(),
              type: "files",
              sort: ["file.is_dir:desc", sort === undefined || sort === null ? "_score" : "file.".concat(sort, ".raw:").concat(order), "file.name:".concat(order)],
              body: {
                query: {
                  bool: {
                    must_not: [{
                      match: {
                        "file.dir_id": {
                          query: trash_dir_id.toString(),
                          operator: "AND"
                        }
                      }
                    }],
                    must: must
                  }
                }
              }
            };
            offset = _page * constants.FILE_LIMITS_PER_PAGE;
            query_for_count = _objectSpread({}, esQuery);

            if (query_for_count.sort) {
              delete query_for_count.sort;
            }

            _context8.next = 37;
            return _elasticsearchclient["default"].count(query_for_count);

          case 37:
            esCount = _context8.sent;

            if (export_excel) {
              _context8.next = 46;
              break;
            }

            esQuery["from"] = offset;
            esQuery["size"] = parseInt(offset) + 30;
            _context8.next = 43;
            return _elasticsearchclient["default"].search(esQuery);

          case 43:
            esResult = _context8.sent;
            _context8.next = 49;
            break;

          case 46:
            _context8.next = 48;
            return _elasticsearchclient["default"].searchAll(esQuery);

          case 48:
            esResult = _context8.sent;

          case 49:
            total = esCount.body.count;
            esResultIds = esResult.body.hits.hits.map(function (hit) {
              return _mongoose["default"].Types.ObjectId(hit._id);
            });
            conditions = {
              dir_id: {
                $ne: trash_dir_id
              },
              is_display: true,
              is_deleted: false,
              $and: [{
                _id: {
                  $in: esResultIds
                }
              }]
            };
            limit = export_excel && total !== 0 ? total : constants.FILE_LIMITS_PER_PAGE;

            if (!(typeof order === "string" && order !== "asc" && order !== "desc")) {
              _context8.next = 55;
              break;
            }

            throw new _AppError.ValidationError("sort is empty");

          case 55:
            _context8.next = 57;
            return createSortOption(sort, order);

          case 57:
            _sort = _context8.sent;

            if (!_mongoose["default"].Types.ObjectId.isValid(sort)) {
              _context8.next = 64;
              break;
            }

            _context8.next = 61;
            return _File["default"].searchFiles(conditions, 0, limit, _sort, _mongoose["default"].Types.ObjectId(sort));

          case 61:
            files = _context8.sent;
            _context8.next = 67;
            break;

          case 64:
            _context8.next = 66;
            return _File["default"].searchFiles(conditions, 0, limit, _sort);

          case 66:
            files = _context8.sent;

          case 67:
            _context8.next = 69;
            return Promise.all(files.map(
            /*#__PURE__*/
            function () {
              var _ref11 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee7(file) {
                var route, es_file;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        route = file.dirs.filter(function (dir) {
                          return dir.ancestor.is_display;
                        }).map(function (dir) {
                          return dir.ancestor.name;
                        });
                        file.dir_route = route.length > 0 ? route.reverse().join("/") : "";
                        file.actions = extractFileActions(file.authorities, res.user);
                        _context7.next = 5;
                        return _elasticsearchclient["default"].getFile(tenant_id.toString(), file._id);

                      case 5:
                        es_file = _context7.sent;

                        if (es_file !== null || es_file !== undefined) {
                          file.full_text = es_file.full_text;
                          file.meta_text = es_file.meta_text;
                          file.search_result = '';
                        }

                        return _context7.abrupt("return", file);

                      case 8:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x20) {
                return _ref11.apply(this, arguments);
              };
            }()));

          case 69:
            files = _context8.sent;

            if (!export_excel) {
              _context8.next = 74;
              break;
            }

            return _context8.abrupt("return", files);

          case 74:
            res.json({
              status: {
                success: true,
                total: total
              },
              body: files
            });

          case 75:
            _context8.next = 90;
            break;

          case 77:
            _context8.prev = 77;
            _context8.t0 = _context8["catch"](1);
            errors = {};
            _context8.t1 = _context8.t0.message;
            _context8.next = _context8.t1 === "page is not number" ? 83 : _context8.t1 === "sort is empty" ? 85 : 87;
            break;

          case 83:
            errors.page = "pageが数字ではないためファイル一覧の取得に失敗しました";
            return _context8.abrupt("break", 88);

          case 85:
            errors.sort = "ソート条件が不正なためファイル一覧の取得に失敗しました";
            return _context8.abrupt("break", 88);

          case 87:
            errors.unknown = _context8.t0;

          case 88:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイル一覧の取得に失敗しました",
                errors: errors
              }
            });

          case 90:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 77]]);
  }));

  return function searchDetail(_x17, _x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * ファイル名変更
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.searchDetail = searchDetail;

var rename =
/*#__PURE__*/
function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(req, res, next) {
    var file_id, changedFileName, file, changedFile, tenant_id, updatedFile, errors;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            file_id = req.params.file_id;
            changedFileName = req.body.name;

            if (!(file_id === null || file_id === undefined || file_id === "")) {
              _context9.next = 5;
              break;
            }

            throw "file_id is empty";

          case 5:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context9.next = 7;
              break;
            }

            throw "file_id is invalid";

          case 7:
            if (!(changedFileName === null || changedFileName === undefined || changedFileName === "")) {
              _context9.next = 9;
              break;
            }

            throw "name is empty";

          case 9:
            if (!changedFileName.match(new RegExp(constants.ILLIGAL_CHARACTERS.join("|")))) {
              _context9.next = 11;
              break;
            }

            throw "name is invalid";

          case 11:
            _context9.next = 13;
            return _File["default"].findById(file_id);

          case 13:
            file = _context9.sent;

            if (!(file === null)) {
              _context9.next = 16;
              break;
            }

            throw "file is empty";

          case 16:
            file.name = changedFileName;
            _context9.next = 19;
            return file.save();

          case 19:
            changedFile = _context9.sent;
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context9.next = 23;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 23:
            updatedFile = _context9.sent;
            _context9.next = 26;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 26:
            res.json({
              status: {
                success: true
              },
              body: changedFile
            });
            _context9.next = 49;
            break;

          case 29:
            _context9.prev = 29;
            _context9.t0 = _context9["catch"](0);
            errors = {};
            _context9.t1 = _context9.t0;
            _context9.next = _context9.t1 === "file_id is empty" ? 35 : _context9.t1 === "file_id is invalid" ? 37 : _context9.t1 === "file is empty" ? 39 : _context9.t1 === "name is empty" ? 41 : _context9.t1 === "name is invalid" ? 43 : 45;
            break;

          case 35:
            errors.file_id = "file_id is empty";
            return _context9.abrupt("break", 47);

          case 37:
            errors.file_id = "ファイルIDが不正のためファイル名の変更に失敗しました";
            return _context9.abrupt("break", 47);

          case 39:
            errors.file_id = "指定されたファイルが存在しないためファイル名の変更に失敗しました";
            return _context9.abrupt("break", 47);

          case 41:
            errors.file_name = "ファイル名が空のためファイル名の変更に失敗しました";
            return _context9.abrupt("break", 47);

          case 43:
            errors.file_name = "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイル名の変更に失敗しました";
            return _context9.abrupt("break", 47);

          case 45:
            errors.unknown = _context9.t0;
            return _context9.abrupt("break", 47);

          case 47:
            _logger["default"].error(_context9.t0);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイル名の変更に失敗しました",
                errors: errors
              }
            });

          case 49:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 29]]);
  }));

  return function rename(_x21, _x22, _x23) {
    return _ref12.apply(this, arguments);
  };
}();
/**
 * ファイルの移動
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 不具合: quz 下階層から上階層へ移動するとエラー
 */


exports.rename = rename;

var move =
/*#__PURE__*/
function () {
  var _ref13 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(req, res, next) {
    var file_id, tenant_id, _ref14, trash_dir_id, dir_id, user, isPermittedFile, isPermittedDir, file, dir, changedFile, defaultAuthArray, defaultAuth, docs, i, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            file_id = req.params.file_id;
            tenant_id = res.user.tenant_id;
            _context10.next = 5;
            return _Tenant["default"].findOne(tenant_id);

          case 5:
            _ref14 = _context10.sent;
            trash_dir_id = _ref14.trash_dir_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context10.next = 9;
              break;
            }

            throw "file_id is empty";

          case 9:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context10.next = 11;
              break;
            }

            throw "file_id is invalid";

          case 11:
            dir_id = req.body.dir_id;

            if (!(dir_id === undefined || dir_id === null || dir_id === "")) {
              _context10.next = 14;
              break;
            }

            throw "dir_id is empty";

          case 14:
            if (_mongoose["default"].Types.ObjectId.isValid(dir_id)) {
              _context10.next = 16;
              break;
            }

            throw "dir_id is invalid";

          case 16:
            _context10.next = 18;
            return _User["default"].findById(res.user._id);

          case 18:
            user = _context10.sent;

            if (!(user === null)) {
              _context10.next = 21;
              break;
            }

            throw "user is empty";

          case 21:
            _context10.next = 23;
            return checkFilePermission(file_id, user._id, constants.PERMISSION_MOVE);

          case 23:
            isPermittedFile = _context10.sent;
            _context10.next = 26;
            return checkFilePermission(dir_id, user._id, constants.PERMISSION_UPLOAD);

          case 26:
            isPermittedDir = _context10.sent;

            if (isPermittedFile && isPermittedDir) {
              _context10.next = 29;
              break;
            }

            throw "permission denied";

          case 29:
            _context10.next = 31;
            return _File["default"].findById(file_id);

          case 31:
            file = _context10.sent;
            _context10.next = 34;
            return _File["default"].findById(dir_id);

          case 34:
            dir = _context10.sent;

            if (!(file === null)) {
              _context10.next = 37;
              break;
            }

            throw "file is empty";

          case 37:
            if (!(dir === null)) {
              _context10.next = 39;
              break;
            }

            throw "dir is empty";

          case 39:
            if (!file.is_dir) {
              _context10.next = 42;
              break;
            }

            _context10.next = 64;
            break;

          case 42:
            file.is_trash = dir._id.toString() === trash_dir_id;
            _context10.next = 45;
            return moveFile(file, dir._id, user, "移動");

          case 45:
            changedFile = _context10.sent;
            _context10.next = 48;
            return _AuthorityFile["default"].find({
              files: file._id,
              is_default: true
            });

          case 48:
            defaultAuthArray = _context10.sent;
            // デフォルト権限を取得
            defaultAuth = null;

            if (defaultAuthArray.length > 0) {
              defaultAuth = defaultAuthArray[0];
            } // ファイル権限を移動先フォルダの権限に張替え


            _context10.next = 53;
            return _AuthorityFile["default"].remove({
              files: changedFile._id,
              is_default: {
                $ne: true
              }
            });

          case 53:
            _context10.next = 55;
            return _AuthorityFile["default"].find({
              files: changedFile.dir_id
            });

          case 55:
            docs = _context10.sent;
            _context10.t0 = _regenerator["default"].keys(docs);

          case 57:
            if ((_context10.t1 = _context10.t0()).done) {
              _context10.next = 64;
              break;
            }

            i = _context10.t1.value;

            if (_AuthorityFile["default"].equal(defaultAuth, docs[i])) {
              _context10.next = 62;
              break;
            }

            _context10.next = 62;
            return _AuthorityFile["default"].create({
              files: file._id,
              role_files: docs[i].role_files,
              users: docs[i].users,
              groups: docs[i].groups
            });

          case 62:
            _context10.next = 57;
            break;

          case 64:
            _context10.next = 66;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 66:
            updatedFile = _context10.sent;
            _context10.next = 69;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 69:
            res.json({
              status: {
                success: true
              },
              body: changedFile
            });
            _context10.next = 97;
            break;

          case 72:
            _context10.prev = 72;
            _context10.t2 = _context10["catch"](0);
            errors = {};
            _context10.t3 = _context10.t2;
            _context10.next = _context10.t3 === "file_id is empty" ? 78 : _context10.t3 === "file_id is invalid" ? 80 : _context10.t3 === "file is empty" ? 82 : _context10.t3 === "dir_id is empty" ? 84 : _context10.t3 === "dir_id is invalid" ? 86 : _context10.t3 === "dir is empty" ? 88 : _context10.t3 === "target is the same as folder" ? 90 : _context10.t3 === "permission denied" ? 92 : 94;
            break;

          case 78:
            errors.file_id = "";
            return _context10.abrupt("break", 96);

          case 80:
            errors.file_id = "ファイルIDが不正のためファイルの移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 82:
            errors.file_id = "指定されたファイルが存在しないためファイルの移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 84:
            errors.dir_id = "フォルダIDが空のためファイルの移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 86:
            errors.dir_id = "フォルダIDが不正のためファイルの移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 88:
            errors.dir_id = "指定されたフォルダが存在しないためファイルの移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 90:
            errors.dir_id = "移動対象のフォルダと指定されたフォルダが同じため移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 92:
            errors.file_id = "指定されたファイルを移動する権限がないため移動に失敗しました";
            return _context10.abrupt("break", 96);

          case 94:
            errors.unknown = _context10.t2;
            return _context10.abrupt("break", 96);

          case 96:
            res.status(400).json({
              status: {
                success: false,
                message: "ファイルの移動に失敗しました",
                errors: errors
              }
            });

          case 97:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 72]]);
  }));

  return function move(_x24, _x25, _x26) {
    return _ref13.apply(this, arguments);
  };
}();
/**
 * ファイルのアップロード
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.move = move;

var upload =
/*#__PURE__*/
function () {
  var _ref15 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee13(req, res, next) {
    var myFiles, dir_id, tenant_id, dir, user, isPermitted, files, master_metainfos, tags, role_files, users, groups, fileModels, swift, zipFiles, i, _zipFiles$i, file, model, regex, matches, data, tenant_name, role, authorityFiles, fileMetaInfos, changedFiles, _i, saveFileModel, j, saveFileMetaInfo, _j, saveAuthorityFile, returnfiles, changedFileIds, sortOption, indexingFile, fullTextSettingEnabled, kafka_payloads, _errors, errors;

    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;
            myFiles = req.body.files;
            dir_id = req.body.dir_id;
            tenant_id = res.user.tenant_id.toString();

            if (!(myFiles === null || myFiles === undefined || myFiles === "" || myFiles.length === 0)) {
              _context13.next = 6;
              break;
            }

            throw "files is empty";

          case 6:
            if (dir_id === null || dir_id === undefined || dir_id === "" || dir_id === "undefined") {
              dir_id = res.user.tenant.home_dir_id; // デフォルトはテナントのホーム
            }

            _context13.next = 9;
            return _File["default"].findById(dir_id);

          case 9:
            dir = _context13.sent;

            if (!(dir === null)) {
              _context13.next = 12;
              break;
            }

            throw "dir is not found";

          case 12:
            _context13.next = 14;
            return _User["default"].findById(res.user._id);

          case 14:
            user = _context13.sent;

            if (!(user === null)) {
              _context13.next = 17;
              break;
            }

            throw "user is not found";

          case 17:
            _context13.next = 19;
            return checkFilePermission(dir_id, user._id, constants.PERMISSION_UPLOAD);

          case 19:
            isPermitted = _context13.sent;

            if (!(isPermitted === false)) {
              _context13.next = 22;
              break;
            }

            throw "permission denied";

          case 22:
            // ファイルの基本情報
            // Modelで定義されていないプロパティを使いたいので
            // オブジェクトで作成し、後でModelObjectに一括変換する
            files = myFiles.map(function (_file) {
              var file = {
                hasError: false,
                // エラーフラグ
                errors: {} // エラー情報

              };

              if (_file.name === null || _file.name === undefined || _file.name === "" || _file.name === "undefined") {
                file.hasError = true;
                file.errors = {
                  name: "ファイル名が空のためファイルのアップロードに失敗しました"
                };
                return file;
              }

              if (_file.name.match(new RegExp(constants.ILLIGAL_CHARACTERS.join("|")))) {
                file.hasError = true;
                file.errors = {
                  name: "ファイル名に禁止文字(\\, / , :, *, ?, <, >, |)が含まれているためファイルのアップロードに失敗しました"
                };
                return file;
              }

              if (_file.mime_type === null || _file.mime_type === undefined || _file.mime_type === "" || _file.mime_type === "undefined") {
                file.hasError = true;
                file.errors = {
                  mime_type: "mime_typeが空のためファイルのアップロードに失敗しました"
                };
                return file;
              }

              if (_file.size === null || _file.size === undefined || _file.size === "" || _file.size === "undefined") {
                file.hasError = true;
                file.errors = {
                  size: "size is empty"
                };
                return file;
              }

              if (_file.base64 === null || _file.base64 === undefined || _file.base64 === "" || _file.base64 === "undefined") {
                file.hasError = true;
                file.errors = {
                  base64: "base64が空のためファイルのアップロードに失敗しました"
                };
                return file;
              }

              if (_file.base64.match(/;base64,(.*)$/) === null) {
                file.hasError = true;
                file.errors = {
                  base64: "base64が不正のためファイルのアップロードに失敗しました"
                };
                return file;
              }

              if (_file.checksum === null || _file.checksum === undefined || _file.checksum === "") {
                file.hasError = true;
                file.errors = {
                  checksum: "checksumが空のためファイルのアップロードに失敗しました"
                };
                return file;
              }

              file.name = _file.name;
              file.mime_type = _file.mime_type;
              file.size = _file.size;
              file.modified = (0, _moment["default"])().format("YYYY-MM-DD HH:mm:ss");
              file.is_dir = false;
              file.dir_id = dir_id;
              file.is_display = true;
              file.is_star = false;
              file.tags = _file.tags;
              file.is_crypted = constants.USE_CRYPTO;
              file.meta_infos = _file.meta_infos;
              file.base64 = _file.base64;
              file.checksum = _file.checksum;
              file.authorities = _file.authorities;
              return file;
            }); // checksumを比較

            files = files.map(function (file) {
              if (file.hasError) return file;

              var hexdigest = _crypto["default"].createHash("md5").update(new Buffer(file.base64)).digest("hex");

              if (file.checksum === hexdigest) {
                return file;
              } else {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    checksum: "checksumが不正のためファイルのアップロードに失敗しました"
                  }
                });
              }
            }); // postされたメタ情報の_idがマスタに存在するかのチェック用

            _context13.next = 26;
            return _MetaInfo["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 26:
            master_metainfos = _context13.sent;
            // メタ情報のチェック
            files = files.map(function (file) {
              if (file.hasError) return file;
              if (file.meta_infos === undefined || file.meta_infos.length === 0) return file; // 値の空チェック

              var valueCheck = file.meta_infos.filter(function (meta) {
                return meta.value === undefined || meta.value === null || meta.value === "" || meta.value === "undefined";
              });

              if (valueCheck.length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    meta_info_value: "指定されたメタ情報の値が空のためファイルのアップロードに失敗しました"
                  }
                });
              } // idのnullチェック


              var idIsEmpty = file.meta_infos.filter(function (meta) {
                return meta._id === undefined || meta._id === null || meta._id === "" || meta._id === "undefined";
              });

              if (idIsEmpty.length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    meta_info_id: "メタ情報IDが空のためファイルのアップロードに失敗しました"
                  }
                });
              }

              var idIsInvalid = file.meta_infos.filter(function (meta) {
                return !_mongoose["default"].Types.ObjectId.isValid(meta._id);
              });

              if (idIsInvalid.length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    meta_info_id: "メタ情報IDが不正のためファイルのアップロードに失敗しました"
                  }
                });
              } // メタ情報idが存在するかのチェック


              var intersec = (0, _.intersection)(file.meta_infos.map(function (meta) {
                return meta._id;
              }), master_metainfos.map(function (meta) {
                return meta._id.toString();
              }));

              if (file.meta_infos.length !== intersec.length) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    meta_info_id: "指定されたメタ情報が存在しないためファイルのアップロードに失敗しました"
                  }
                });
              } // 日付型チェック


              var date_is_invalid = file.meta_infos.filter(function (meta) {
                var _meta = master_metainfos.filter(function (m) {
                  return m._id.toString() === meta._id;
                })[0];

                if (_meta.value_type === "Date") {
                  return !(0, _moment["default"])(meta.value).isValid();
                } else {
                  return false;
                }
              });

              if (date_is_invalid.length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    meta_info_value: "指定されたメタ情報の値が日付型ではないためファイルのアップロードに失敗しました"
                  }
                });
              }

              return file;
            }); // タグがマスタに存在するかのチェック

            _context13.next = 30;
            return _Tag["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 30:
            _context13.t0 = function (tag) {
              return tag._id.toString();
            };

            tags = _context13.sent.map(_context13.t0);
            files = files.map(function (file) {
              if (file.hasError) return file;

              if (file.tags === undefined || file.tags === null || file.tags === "" || file.tags.length === 0) {
                return file;
              }

              var tagIsEmpty = file.tags.filter(function (tag) {
                return tag === undefined || tag === null || tag === "";
              });

              if (tagIsEmpty.length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    tag_id: "指定されたタグIDが空のためファイルのアップロードに失敗しました"
                  }
                });
              }

              if ((0, _.uniq)(file.tags).length === (0, _.intersection)(file.tags, tags).length) {
                // stringからBSONに変換
                file.tags = file.tags.map(function (tag) {
                  return _mongoose["default"].Types.ObjectId(tag);
                });
                return file;
              } else {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    tag_id: "タグIDが不正のためファイルのアップロードに失敗しました"
                  }
                });
              }
            }); // ロール、ユーザ、グループがマスタに存在するかのチェック

            _context13.next = 35;
            return _RoleFile["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 35:
            _context13.t1 = function (role) {
              return role._id.toString();
            };

            role_files = _context13.sent.map(_context13.t1);
            _context13.next = 39;
            return _User["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 39:
            _context13.t2 = function (user) {
              return user._id.toString();
            };

            users = _context13.sent.map(_context13.t2);
            _context13.next = 43;
            return _Group["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 43:
            _context13.t3 = function (group) {
              return group._id.toString();
            };

            groups = _context13.sent.map(_context13.t3);
            files = files.map(function (file) {
              if (file.hasError) return file;

              if (file.authorities === undefined || file.authorities === null || file.authorities === "" || file.authorities.length === 0) {
                file.authorities = [];
                return file;
              }

              var roleIds = file.authorities.map(function (auth) {
                return auth.role_files;
              });

              if (roleIds.filter(function (id) {
                return id === undefined || id === null || id === "";
              }).length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_file_id: "指定されたロールIDが空のためファイルのアップロードに失敗しました"
                  }
                });
              }

              if (roleIds.filter(function (id) {
                return !_mongoose["default"].Types.ObjectId.isValid(id);
              }).length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_file_id: "指定されたロールIDが不正のためファイルのアップロードに失敗しました"
                  }
                });
              }

              if ((0, _.uniq)(roleIds).length !== (0, _.intersection)(roleIds, role_files).length) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_file_id: "指定されたロールが存在しないためファイルのアップロードに失敗しました"
                  }
                });
              }

              var userIds = file.authorities.map(function (auth) {
                return auth.users;
              });

              if (userIds.filter(function (id) {
                return id === undefined || id === null || id === "";
              }).length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_user_id: "指定されたユーザIDが空のためファイルのアップロードに失敗しました"
                  }
                });
              }

              if (userIds.filter(function (id) {
                return !_mongoose["default"].Types.ObjectId.isValid(id);
              }).length > 0) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_user_id: "指定されたユーザIDが不正のためファイルのアップロードに失敗しました"
                  }
                });
              }

              if (userIds.length !== (0, _.intersection)(userIds, users).length) {
                return _objectSpread({}, file, {
                  hasError: true,
                  errors: {
                    role_user_id: "指定されたユーザが存在しないためファイルのアップロードに失敗しました"
                  }
                });
              }

              return file;
            }); // 履歴

            files = files.map(function (file) {
              if (file.hasError) return file;
              var histories = [{
                modified: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss"),
                user: user,
                action: "新規作成",
                body: ""
              }];
              file.histories = histories;
              return file;
            }); // ファイルオブジェクト作成

            fileModels = files.map(function (file) {
              return file.hasError ? false : new _File["default"](file);
            }); // swift

            swift = new _Swift.Swift();
            zipFiles = (0, _.zipWith)(files, fileModels, function (file, model) {
              return {
                file: file,
                model: model
              };
            });
            i = 0;

          case 51:
            if (!(i < zipFiles.length)) {
              _context13.next = 73;
              break;
            }

            _zipFiles$i = zipFiles[i], file = _zipFiles$i.file, model = _zipFiles$i.model;

            if (!file.hasError) {
              _context13.next = 55;
              break;
            }

            return _context13.abrupt("continue", 70);

          case 55:
            regex = /;base64,(.*)$/;
            matches = file.base64.match(regex);
            data = matches[1];
            tenant_name = res.user.tenant.name;
            _context13.prev = 59;
            file.buffer = new Buffer(data, 'base64');
            _context13.next = 63;
            return swift.upload(tenant_name, file.buffer, model._id.toString());

          case 63:
            _context13.next = 70;
            break;

          case 65:
            _context13.prev = 65;
            _context13.t4 = _context13["catch"](59);

            _logger["default"].info(_context13.t4);

            fileModels[i] = false;
            files[i] = _objectSpread({}, files[i], {
              hasError: true,
              errors: {
                data: "ファイル本体の保存に失敗しました"
              }
            });

          case 70:
            i++;
            _context13.next = 51;
            break;

          case 73:
            _context13.next = 75;
            return _RoleFile["default"].findOne({
              tenant_id: _mongoose["default"].Types.ObjectId(res.user.tenant_id),
              name: "フルコントロール" // @fixme

            });

          case 75:
            role = _context13.sent;
            _context13.next = 78;
            return Promise.all((0, _.zipWith)(files, fileModels,
            /*#__PURE__*/
            function () {
              var _ref16 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee11(file, model) {
                var authorityFile, inheritAuthEnabled, authorityFiles, parentFile, inheritAuths;
                return _regenerator["default"].wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        if (!file.hasError) {
                          _context11.next = 2;
                          break;
                        }

                        return _context11.abrupt("return", false);

                      case 2:
                        authorityFile = new _AuthorityFile["default"]();
                        authorityFile.users = user._id;
                        authorityFile.files = model;
                        authorityFile.role_files = role._id; // フォルダの権限を継承する設定かどうか？      

                        _context11.next = 8;
                        return _AppSetting["default"].getSettings(tenant_id);

                      case 8:
                        _context11.t0 = _AppSetting["default"].INHERIT_PARENT_DIR_AUTH;
                        inheritAuthEnabled = _context11.sent[_context11.t0];
                        authorityFiles = [];

                        if (!inheritAuthEnabled) {
                          _context11.next = 19;
                          break;
                        }

                        _context11.next = 14;
                        return _File["default"].findById(file.dir_id);

                      case 14:
                        parentFile = _context11.sent;
                        _context11.next = 17;
                        return _AuthorityFile["default"].find({
                          files: parentFile._id
                        });

                      case 17:
                        inheritAuths = _context11.sent;
                        authorityFiles = inheritAuths.map(function (ihr) {
                          return new _AuthorityFile["default"]({
                            groups: ihr.groups ? _mongoose["default"].Types.ObjectId(ihr.groups) : null,
                            users: ihr.users ? _mongoose["default"].Types.ObjectId(ihr.users) : null,
                            files: model,
                            role_files: _mongoose["default"].Types.ObjectId(ihr.role_files)
                          });
                        });

                      case 19:
                        if (file.authorities.length > 0) {
                          authorityFiles = file.authorities.map(function (auth) {
                            var authorityFile = new _AuthorityFile["default"]();
                            authorityFile.users = _mongoose["default"].Types.ObjectId(auth.users);
                            authorityFile.files = model;
                            authorityFile.role_files = _mongoose["default"].Types.ObjectId(auth.role_files);
                            return authorityFile;
                          }).concat(authorityFiles);
                        }

                        authorityFiles = authorityFiles.concat(authorityFile);
                        authorityFiles = (0, _.uniqWith)(authorityFiles, function (a, b) {
                          return (0, _.isEqualWith)(a, b, function (a, b) {
                            return a.files.toString() === b.files.toString() && _AuthorityFile["default"].equal(a, b);
                          });
                        });
                        authorityFiles = authorityFiles.map(function (auth) {
                          return new _AuthorityFile["default"]({
                            groups: auth.groups,
                            users: auth.users,
                            files: auth.files,
                            role_files: auth.role_files,
                            is_default: _AuthorityFile["default"].equal(authorityFile, auth)
                          });
                        });
                        return _context11.abrupt("return", authorityFiles);

                      case 24:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11);
              }));

              return function (_x30, _x31) {
                return _ref16.apply(this, arguments);
              };
            }()));

          case 78:
            authorityFiles = _context13.sent;
            // メタ情報
            fileMetaInfos = (0, _.zipWith)(files, fileModels, function (file, model) {
              if (file.hasError) return false;
              if (file.meta_infos === undefined || file.meta_infos === null || file.meta_infos.length === 0) return false;
              return file.meta_infos.map(function (meta) {
                return new _FileMetaInfo["default"]({
                  file_id: model._id,
                  meta_info_id: meta._id,
                  value: meta.value
                });
              });
            }); // mongoへの保存開始

            changedFiles = [];
            _i = 0;

          case 82:
            if (!(_i < fileModels.length)) {
              _context13.next = 119;
              break;
            }

            if (fileModels[_i]) {
              _context13.next = 85;
              break;
            }

            return _context13.abrupt("continue", 116);

          case 85:
            _context13.next = 87;
            return fileModels[_i].save();

          case 87:
            saveFileModel = _context13.sent;
            changedFiles.push(saveFileModel);

            if (saveFileModel) {
              _context13.next = 94;
              break;
            }

            files[_i] = _objectSpread({}, files[_i], {
              hasError: true,
              errors: {
                body: "基本情報の書き込みに失敗しました"
              }
            });
            return _context13.abrupt("continue", 116);

          case 94:
            files[_i]._id = saveFileModel._id.toString();

          case 95:
            if (!(fileMetaInfos[_i].length > 0)) {
              _context13.next = 106;
              break;
            }

            j = 0;

          case 97:
            if (!(j < fileMetaInfos[_i].length)) {
              _context13.next = 106;
              break;
            }

            if (!fileMetaInfos[_i][j]) {
              _context13.next = 103;
              break;
            }

            _context13.next = 101;
            return fileMetaInfos[_i][j].save();

          case 101:
            saveFileMetaInfo = _context13.sent;

            if (!saveFileMetaInfo) {
              files[_i] = _objectSpread({}, files[_i], {
                hasError: true,
                errors: {
                  meta_infos: "メタ情報の書き込みに失敗しました"
                }
              });
            }

          case 103:
            j++;
            _context13.next = 97;
            break;

          case 106:
            if (!(authorityFiles[_i].length > 0)) {
              _context13.next = 116;
              break;
            }

            _j = 0;

          case 108:
            if (!(_j < authorityFiles[_i].length)) {
              _context13.next = 116;
              break;
            }

            _context13.next = 111;
            return authorityFiles[_i][_j].save();

          case 111:
            saveAuthorityFile = _context13.sent;

            if (!saveAuthorityFile) {
              files[_i] = _objectSpread({}, files[_i], {
                hasError: true,
                errors: {
                  authority_files: "権限の書き込みに失敗しました"
                }
              });
            }

          case 113:
            _j++;
            _context13.next = 108;
            break;

          case 116:
            _i++;
            _context13.next = 82;
            break;

          case 119:
            if (!(changedFiles.length > 0)) {
              _context13.next = 140;
              break;
            }

            changedFileIds = changedFiles.map(function (file) {
              return file._id;
            }); // 自動タイムスタンプ（対象外であれば処理されない）

            _context13.next = 123;
            return Promise.all(changedFiles.map(
            /*#__PURE__*/
            function () {
              var _ref17 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee12(f) {
                return _regenerator["default"].wrap(function _callee12$(_context12) {
                  while (1) {
                    switch (_context12.prev = _context12.next) {
                      case 0:
                        _context12.next = 2;
                        return autoGrantTimestamp(f, res.user.tenant._id);

                      case 2:
                        return _context12.abrupt("return", _context12.sent);

                      case 3:
                      case "end":
                        return _context12.stop();
                    }
                  }
                }, _callee12);
              }));

              return function (_x32) {
                return _ref17.apply(this, arguments);
              };
            }()))["catch"](function (e) {
              return Promise.reject(e);
            });

          case 123:
            _context13.next = 125;
            return createSortOption();

          case 125:
            sortOption = _context13.sent;
            _context13.next = 128;
            return _File["default"].searchFiles({
              _id: {
                $in: changedFileIds
              }
            }, 0, changedFileIds.length, sortOption);

          case 128:
            indexingFile = _context13.sent;
            _context13.next = 131;
            return _elasticsearchclient["default"].createIndex(tenant_id, indexingFile);

          case 131:
            _context13.next = 133;
            return _AppSetting["default"].getSettings(tenant_id);

          case 133:
            _context13.t5 = _AppSetting["default"].FULL_TEXT_SEARCH_ENABLED;
            fullTextSettingEnabled = _context13.sent[_context13.t5];

            if (!fullTextSettingEnabled) {
              _context13.next = 139;
              break;
            }

            kafka_payloads = _.filter(files, function (file) {
              return !file.hasError;
            }).map(function (file) {
              return {
                topic: constants.KAFKA_TOPIC_TIKA_NAME,
                messages: JSON.stringify({
                  tenant_id: tenant_id,
                  tenant_name: res.user.tenant.name,
                  file_id: file._id //buffer: file.buffer,

                })
              };
            }); // kafkaに送信

            _context13.next = 139;
            return (0, _index.produce)(kafka_payloads);

          case 139:
            returnfiles = indexingFile.map(function (file) {
              file.actions = extractFileActions(file.authorities, res.user);
              return file;
            });

          case 140:
            // validationErrors
            if (files.filter(function (f) {
              return f.hasError;
            }).length > 0) {
              _errors = files.map(function (f) {
                if (f.hasError === false) return {};
                return f.errors;
              });

              _logger["default"].error(_errors);

              res.status(400).json({
                status: {
                  success: false,
                  message: "ファイルのアップロードに失敗しました",
                  errors: _errors
                }
              });
            } else {
              res.json({
                status: {
                  success: true
                },
                body: returnfiles
              });
            }

            _context13.next = 159;
            break;

          case 143:
            _context13.prev = 143;
            _context13.t6 = _context13["catch"](0);
            errors = {};

            _logger["default"].error(_context13.t6);

            _context13.t7 = _context13.t6;
            _context13.next = _context13.t7 === "files is empty" ? 150 : _context13.t7 === "dir_id is empty" ? 152 : _context13.t7 === "permission denied" ? 154 : 156;
            break;

          case 150:
            errors.files = "アップロード対象のファイルが空のためファイルのアップロードに失敗しました";
            return _context13.abrupt("break", 158);

          case 152:
            errors.dir_id = "フォルダIDが空のためファイルのアップロードに失敗しました";
            return _context13.abrupt("break", 158);

          case 154:
            errors.dir_id = "フォルダにアップロード権限が無いためファイルのアップロードに失敗しました";
            return _context13.abrupt("break", 158);

          case 156:
            errors.unknown = _context13.t6;
            return _context13.abrupt("break", 158);

          case 158:
            res.status(400).json({
              status: {
                success: false,
                message: "ファイルのアップロードに失敗しました",
                errors: errors
              }
            });

          case 159:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 143], [59, 65]]);
  }));

  return function upload(_x27, _x28, _x29) {
    return _ref15.apply(this, arguments);
  };
}();

exports.upload = upload;

var autoGrantTimestamp =
/*#__PURE__*/
function () {
  var _ref18 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee14(file, tenant_id) {
    var parentDir, autoGrantTsInfo;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return _File["default"].searchFileOne({
              _id: file.dir_id
            });

          case 2:
            parentDir = _context14.sent;
            autoGrantTsInfo = parentDir.meta_infos.find(function (m) {
              return m.name === "auto_grant_timestamp";
            });

            if (!(autoGrantTsInfo && autoGrantTsInfo.value)) {
              _context14.next = 7;
              break;
            }

            _context14.next = 7;
            return (0, _timestamps.grantTimestampToken)(file._id, tenant_id);

          case 7:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14);
  }));

  return function autoGrantTimestamp(_x33, _x34) {
    return _ref18.apply(this, arguments);
  };
}();
/**
 * ファイルタグを追加する
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


var addTag =
/*#__PURE__*/
function () {
  var _ref19 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee15(req, res, next) {
    var file_id, tag_id, file, tag, changedFile, tags, tenant_id, updatedFile, errors;
    return _regenerator["default"].wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.prev = 0;
            file_id = req.params.file_id;
            tag_id = req.body._id;

            if (!(file_id === null || file_id === undefined || file_id === "")) {
              _context15.next = 5;
              break;
            }

            throw "file_id is empty";

          case 5:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context15.next = 7;
              break;
            }

            throw "file_id is invalid";

          case 7:
            if (!(tag_id === null || tag_id === undefined || tag_id === "")) {
              _context15.next = 9;
              break;
            }

            throw "tag_id is empty";

          case 9:
            if (_mongoose["default"].Types.ObjectId.isValid(tag_id)) {
              _context15.next = 11;
              break;
            }

            throw "tag_id is invalid";

          case 11:
            _context15.next = 13;
            return _File["default"].findById(file_id);

          case 13:
            file = _context15.sent;
            _context15.next = 16;
            return _Tag["default"].findById(tag_id);

          case 16:
            tag = _context15.sent;

            if (!(file === null)) {
              _context15.next = 19;
              break;
            }

            throw "file is empty";

          case 19:
            if (!(tag === null)) {
              _context15.next = 21;
              break;
            }

            throw "tag is empty";

          case 21:
            file.tags = [].concat((0, _toConsumableArray2["default"])(file.tags), [tag._id]);
            _context15.next = 24;
            return file.save();

          case 24:
            changedFile = _context15.sent;
            _context15.next = 27;
            return _Tag["default"].find({
              _id: {
                $in: file.tags
              }
            });

          case 27:
            tags = _context15.sent;
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context15.next = 31;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 31:
            updatedFile = _context15.sent;
            _context15.next = 34;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 34:
            res.json({
              status: {
                success: true
              },
              body: _objectSpread({}, file.toObject(), {
                tags: tags
              })
            });
            _context15.next = 58;
            break;

          case 37:
            _context15.prev = 37;
            _context15.t0 = _context15["catch"](0);
            errors = {};
            _context15.t1 = _context15.t0;
            _context15.next = _context15.t1 === "file_id is empty" ? 43 : _context15.t1 === "file_id is invalid" ? 45 : _context15.t1 === "tag_id is empty" ? 47 : _context15.t1 === "tag_id is invalid" ? 49 : _context15.t1 === "file is empty" ? 51 : _context15.t1 === "tag is empty" ? 53 : 55;
            break;

          case 43:
            errors.file_id = _context15.t0;
            return _context15.abrupt("break", 57);

          case 45:
            errors.file_id = "ファイルIDが不正のためタグの追加に失敗しました";
            return _context15.abrupt("break", 57);

          case 47:
            errors.tag_id = _context15.t0;
            return _context15.abrupt("break", 57);

          case 49:
            errors.tag_id = "タグIDが不正のためタグの追加に失敗しました";
            return _context15.abrupt("break", 57);

          case 51:
            errors.file_id = "指定されたファイルが存在しないためタグの追加に失敗しました";
            return _context15.abrupt("break", 57);

          case 53:
            errors.tag_id = "指定されたタグが存在しないためタグの追加に失敗しました";
            return _context15.abrupt("break", 57);

          case 55:
            errors.unknown = _context15.t0;
            return _context15.abrupt("break", 57);

          case 57:
            res.status(400).json({
              status: {
                success: false,
                message: "タグの追加に失敗しました",
                errors: errors
              }
            });

          case 58:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, null, [[0, 37]]);
  }));

  return function addTag(_x35, _x36, _x37) {
    return _ref19.apply(this, arguments);
  };
}();
/**
 * ファイルタグを削除する
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.addTag = addTag;

var removeTag =
/*#__PURE__*/
function () {
  var _ref20 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee16(req, res, next) {
    var _req$params, file_id, tag_id, file, tag, changedFile, tags, tenant_id, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _req$params = req.params, file_id = _req$params.file_id, tag_id = _req$params.tag_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context16.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context16.next = 6;
              break;
            }

            throw "file_id is invalid";

          case 6:
            if (!(tag_id === undefined || tag_id === null || tag_id === "")) {
              _context16.next = 8;
              break;
            }

            throw "tag_id is empty";

          case 8:
            if (_mongoose["default"].Types.ObjectId.isValid(tag_id)) {
              _context16.next = 10;
              break;
            }

            throw "tag_id is invalid";

          case 10:
            _context16.next = 12;
            return _File["default"].findById(file_id);

          case 12:
            file = _context16.sent;
            _context16.next = 15;
            return _Tag["default"].findById(tag_id);

          case 15:
            tag = _context16.sent;

            if (!(file === null)) {
              _context16.next = 18;
              break;
            }

            throw "file is empty";

          case 18:
            if (!(tag === null)) {
              _context16.next = 20;
              break;
            }

            throw "tag is empty";

          case 20:
            file.tags = file.tags.filter(function (file_tag) {
              return file_tag.toString() !== tag.id;
            });
            _context16.next = 23;
            return file.save();

          case 23:
            changedFile = _context16.sent;
            _context16.next = 26;
            return _Tag["default"].find({
              _id: {
                $in: file.tags
              }
            });

          case 26:
            tags = _context16.sent;
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context16.next = 30;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 30:
            updatedFile = _context16.sent;
            _context16.next = 33;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 33:
            res.json({
              status: {
                success: true
              },
              body: _objectSpread({}, file.toObject(), {
                tags: tags
              })
            });
            _context16.next = 57;
            break;

          case 36:
            _context16.prev = 36;
            _context16.t0 = _context16["catch"](0);
            errors = {};
            _context16.t1 = _context16.t0;
            _context16.next = _context16.t1 === "file_id is empty" ? 42 : _context16.t1 === "file_id is invalid" ? 44 : _context16.t1 === "tag_id is empty" ? 46 : _context16.t1 === "file is empty" ? 48 : _context16.t1 === "tag is empty" ? 50 : _context16.t1 === "tag_id is invalid" ? 52 : 54;
            break;

          case 42:
            errors.file_id = _context16.t0;
            return _context16.abrupt("break", 56);

          case 44:
            errors.file_id = "ファイルIDが不正のためタグの削除に失敗しました";
            return _context16.abrupt("break", 56);

          case 46:
            errors.tag_id = _context16.t0;
            return _context16.abrupt("break", 56);

          case 48:
            errors.file_id = "指定されたファイルが存在しないためタグの削除に失敗しました";
            return _context16.abrupt("break", 56);

          case 50:
            errors.tag_id = "指定されたタグが存在しないためタグの削除に失敗しました";
            return _context16.abrupt("break", 56);

          case 52:
            errors.tag_id = "タグIDが不正のためタグの削除に失敗しました";
            return _context16.abrupt("break", 56);

          case 54:
            errors.unknown = _context16.t0;
            return _context16.abrupt("break", 56);

          case 56:
            res.status(400).json({
              status: {
                success: false,
                message: "タグの削除に失敗しました",
                errors: errors
              }
            });

          case 57:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, null, [[0, 36]]);
  }));

  return function removeTag(_x38, _x39, _x40) {
    return _ref20.apply(this, arguments);
  };
}();
/**
 * メタ情報を追加する
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.removeTag = removeTag;

var addMeta =
/*#__PURE__*/
function () {
  var _ref21 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee17(req, res, next) {
    var file_id, tenant_id, _req$body2, meta, value, file, metaInfo, registMetaInfo, changedMeta, _addMeta, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            file_id = req.params.file_id;
            tenant_id = res.user.tenant_id;

            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context17.next = 5;
              break;
            }

            throw "file_id is invalid";

          case 5:
            _req$body2 = req.body, meta = _req$body2.meta, value = _req$body2.value;

            if (!(!meta || meta._id === undefined || meta._id === null || meta._id === "")) {
              _context17.next = 8;
              break;
            }

            throw "metainfo_id is empty";

          case 8:
            if (_mongoose["default"].Types.ObjectId.isValid(meta._id)) {
              _context17.next = 10;
              break;
            }

            throw "metainfo_id is invalid";

          case 10:
            if (!(!value || value === "")) {
              _context17.next = 12;
              break;
            }

            throw "metainfo value is empty";

          case 12:
            _context17.next = 14;
            return _File["default"].findById(file_id);

          case 14:
            file = _context17.sent;
            _context17.next = 17;
            return _MetaInfo["default"].findById(meta._id);

          case 17:
            metaInfo = _context17.sent;

            if (!(file === null)) {
              _context17.next = 20;
              break;
            }

            throw "file is empty";

          case 20:
            if (!(metaInfo === null)) {
              _context17.next = 22;
              break;
            }

            throw "metainfo is empty";

          case 22:
            _context17.next = 24;
            return _FileMetaInfo["default"].findOne({
              file_id: file_id,
              meta_info_id: meta._id
            });

          case 24:
            registMetaInfo = _context17.sent;

            if (!registMetaInfo) {
              _context17.next = 32;
              break;
            }

            registMetaInfo.value = value;
            _context17.next = 29;
            return registMetaInfo.save();

          case 29:
            changedMeta = _context17.sent;
            _context17.next = 36;
            break;

          case 32:
            _addMeta = new _FileMetaInfo["default"]({
              file_id: file_id,
              meta_info_id: metaInfo._id,
              value: value
            });
            _context17.next = 35;
            return _addMeta.save();

          case 35:
            changedMeta = _context17.sent;

          case 36:
            _context17.next = 38;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 38:
            updatedFile = _context17.sent;
            _context17.next = 41;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 41:
            res.json({
              status: {
                success: true
              },
              body: changedMeta
            });
            _context17.next = 65;
            break;

          case 44:
            _context17.prev = 44;
            _context17.t0 = _context17["catch"](0);
            errors = {};
            _context17.t1 = _context17.t0;
            _context17.next = _context17.t1 === "file_id is invalid" ? 50 : _context17.t1 === "file is empty" ? 52 : _context17.t1 === "metainfo_id is empty" ? 54 : _context17.t1 === "metainfo_id is invalid" ? 56 : _context17.t1 === "metainfo is empty" ? 58 : _context17.t1 === "metainfo value is empty" ? 60 : 62;
            break;

          case 50:
            errors.file_id = "ファイルIDが不正のためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 52:
            errors.file_id = "指定されたファイルが存在しないためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 54:
            errors.metainfo_id = "メタ情報IDが空のためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 56:
            errors.metainfo_id = "メタ情報IDが不正のためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 58:
            errors.metainfo_id = "指定されたメタ情報が存在しないためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 60:
            errors.metainfo_value = "メタ情報の値が空のためメタ情報の追加に失敗しました";
            return _context17.abrupt("break", 64);

          case 62:
            errors.unknown = _context17.t0;
            return _context17.abrupt("break", 64);

          case 64:
            res.status(400).json({
              status: {
                success: false,
                message: "メタ情報の追加に失敗しました",
                errors: errors
              }
            });

          case 65:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, null, [[0, 44]]);
  }));

  return function addMeta(_x41, _x42, _x43) {
    return _ref21.apply(this, arguments);
  };
}();
/**
 * メタ情報を削除する
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.addMeta = addMeta;

var removeMeta =
/*#__PURE__*/
function () {
  var _ref22 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee18(req, res, next) {
    var _req$params2, file_id, meta_id, file, metaInfo, _removeMeta, tenant_id, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            _req$params2 = req.params, file_id = _req$params2.file_id, meta_id = _req$params2.meta_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context18.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context18.next = 6;
              break;
            }

            throw "file_id is invalid";

          case 6:
            if (!(meta_id === undefined || meta_id === null || meta_id === "")) {
              _context18.next = 8;
              break;
            }

            throw "meta_id is empty";

          case 8:
            if (_mongoose["default"].Types.ObjectId.isValid(meta_id)) {
              _context18.next = 10;
              break;
            }

            throw "meta_id is invalid";

          case 10:
            _context18.next = 12;
            return _File["default"].findById(file_id);

          case 12:
            file = _context18.sent;
            _context18.next = 15;
            return _MetaInfo["default"].findById(meta_id);

          case 15:
            metaInfo = _context18.sent;

            if (!(file === null)) {
              _context18.next = 18;
              break;
            }

            throw "file is empty";

          case 18:
            if (!(metaInfo === null)) {
              _context18.next = 20;
              break;
            }

            throw "metaInfo is empty";

          case 20:
            _context18.next = 22;
            return _FileMetaInfo["default"].findOne({
              file_id: _mongoose["default"].Types.ObjectId(file_id),
              meta_info_id: _mongoose["default"].Types.ObjectId(meta_id)
            });

          case 22:
            _removeMeta = _context18.sent;

            if (!_removeMeta) {
              _context18.next = 27;
              break;
            }

            _removeMeta.remove();

            _context18.next = 28;
            break;

          case 27:
            throw "meta_id is not registered";

          case 28:
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context18.next = 31;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 31:
            updatedFile = _context18.sent;
            _context18.next = 34;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 34:
            res.json({
              status: {
                success: true
              },
              body: _removeMeta
            });
            _context18.next = 60;
            break;

          case 37:
            _context18.prev = 37;
            _context18.t0 = _context18["catch"](0);
            errors = {};
            _context18.t1 = _context18.t0;
            _context18.next = _context18.t1 === "file_id is empty" ? 43 : _context18.t1 === "file_id is invalid" ? 45 : _context18.t1 === "file is empty" ? 47 : _context18.t1 === "meta_id is empty" ? 49 : _context18.t1 === "meta_id is invalid" ? 51 : _context18.t1 === "metaInfo is empty" ? 53 : _context18.t1 === "meta_id is not registered" ? 55 : 57;
            break;

          case 43:
            errors.file_id = "ファイルIDが空のためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 45:
            errors.file_id = "ファイルIDが不正のためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 47:
            errors.file_id = "指定されたファイルが存在しないためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 49:
            errors.meta_id = _context18.t0;
            return _context18.abrupt("break", 59);

          case 51:
            errors.meta_id = "メタ情報IDが不正のためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 53:
            errors.meta_id = "指定されたメタ情報が存在しないためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 55:
            errors.meta_id = "指定されたメタ情報IDがファイルに存在しないためメタ情報の削除に失敗しました";
            return _context18.abrupt("break", 59);

          case 57:
            errors.unknown = _context18.t0;
            return _context18.abrupt("break", 59);

          case 59:
            res.status(400).json({
              status: {
                success: false,
                message: "メタ情報の削除に失敗しました",
                errors: errors
              }
            });

          case 60:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, null, [[0, 37]]);
  }));

  return function removeMeta(_x44, _x45, _x46) {
    return _ref22.apply(this, arguments);
  };
}();
/**
 * お気に入り印を着脱
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.removeMeta = removeMeta;

var toggleStar =
/*#__PURE__*/
function () {
  var _ref23 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee19(req, res, next) {
    var file_id, file, changedFile, tenant_id, updatedFile, errors;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context19.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context19.next = 6;
              break;
            }

            throw "file_id is invalid";

          case 6:
            _context19.next = 8;
            return _File["default"].findById(file_id);

          case 8:
            file = _context19.sent;

            if (!(file === null)) {
              _context19.next = 11;
              break;
            }

            throw "file is empty";

          case 11:
            file.is_star = !file.is_star;
            _context19.next = 14;
            return file.save();

          case 14:
            changedFile = _context19.sent;
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context19.next = 18;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 18:
            updatedFile = _context19.sent;
            _context19.next = 21;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 21:
            res.json({
              status: {
                success: true
              },
              body: changedFile
            });
            _context19.next = 39;
            break;

          case 24:
            _context19.prev = 24;
            _context19.t0 = _context19["catch"](0);
            errors = {};
            _context19.t1 = _context19.t0;
            _context19.next = _context19.t1 === "file_id is empty" ? 30 : _context19.t1 === "file_id is invalid" ? 32 : _context19.t1 === "file is empty" ? 34 : 36;
            break;

          case 30:
            errors.file_id = "ファイルIDが空のためファイルのお気に入りの設定に失敗しました";
            return _context19.abrupt("break", 38);

          case 32:
            errors.file_id = "ファイルIDが不正のためファイルのお気に入りの設定に失敗しました";
            return _context19.abrupt("break", 38);

          case 34:
            errors.file_id = "指定されたファイルが存在しないためファイルのお気に入りの設定に失敗しました";
            return _context19.abrupt("break", 38);

          case 36:
            errors.unknown = _context19.t0;
            return _context19.abrupt("break", 38);

          case 38:
            res.status(400).json({
              status: {
                success: false,
                message: "ファイルのお気に入りの設定に失敗しました",
                errors: errors
              }
            });

          case 39:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, null, [[0, 24]]);
  }));

  return function toggleStar(_x47, _x48, _x49) {
    return _ref23.apply(this, arguments);
  };
}();
/**
 * ファイルの権限を追加
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.toggleStar = toggleStar;

var _addAuthority = function _addAuthority(file, user, group, role, tenant_id) {
  return (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee20() {
    var authority, _user, duplicated, _group, _duplicated, createdAuthority, updatedFile, esResult;

    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            authority = new _AuthorityFile["default"]();
            authority.files = file;
            authority.role_files = role;

            if (!(user !== undefined && user !== null)) {
              _context20.next = 17;
              break;
            }

            _context20.next = 6;
            return _User["default"].findById(user._id);

          case 6:
            _user = _context20.sent;

            if (!(_user === null)) {
              _context20.next = 9;
              break;
            }

            throw "user is empty";

          case 9:
            authority.users = _user;
            _context20.next = 12;
            return _AuthorityFile["default"].findOne({
              files: authority.files,
              users: authority.users,
              role_files: authority.role_files
            });

          case 12:
            duplicated = _context20.sent;

            if (!(duplicated !== null)) {
              _context20.next = 15;
              break;
            }

            throw "role set is duplicate";

          case 15:
            _context20.next = 28;
            break;

          case 17:
            _context20.next = 19;
            return _Group["default"].findById(group._id);

          case 19:
            _group = _context20.sent;

            if (!(_group === null)) {
              _context20.next = 22;
              break;
            }

            throw new _AppError.RecordNotFoundException("group is empty");

          case 22:
            authority.groups = _group;
            _context20.next = 25;
            return _AuthorityFile["default"].findOne({
              files: authority.files,
              groups: authority.groups,
              role_files: authority.role_files
            });

          case 25:
            _duplicated = _context20.sent;

            if (!(_duplicated !== null)) {
              _context20.next = 28;
              break;
            }

            throw "role set is duplicate";

          case 28:
            _context20.next = 30;
            return authority.save();

          case 30:
            createdAuthority = _context20.sent;
            _context20.next = 33;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file._id)
            });

          case 33:
            updatedFile = _context20.sent;
            _context20.next = 36;
            return _elasticsearchclient["default"].createIndex(tenant_id, [updatedFile]);

          case 36:
            esResult = _context20.sent;
            return _context20.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(esResult);
            }));

          case 38:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  }));
};

var addAuthority = function addAuthority(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee21() {
    var file_id, _req$body3, user, group, role, tenant_id, file, _role, createdAuthority, childrenDirIds, children, idx, child, _authority, _authority2, errors;

    return _regenerator["default"].wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            _context21.prev = 0;
            file_id = req.params.file_id;
            _req$body3 = req.body, user = _req$body3.user, group = _req$body3.group, role = _req$body3.role;
            tenant_id = res.user.tenant_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context21.next = 6;
              break;
            }

            throw "file_id is empty";

          case 6:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context21.next = 8;
              break;
            }

            throw "file_id is invalid";

          case 8:
            _context21.next = 10;
            return _File["default"].findById(file_id);

          case 10:
            file = _context21.sent;

            if (!(file === null)) {
              _context21.next = 13;
              break;
            }

            throw "file is empty";

          case 13:
            _context21.next = 15;
            return _RoleFile["default"].findById(role._id);

          case 15:
            _role = _context21.sent;

            if (!(_role === null)) {
              _context21.next = 18;
              break;
            }

            throw "role is empty";

          case 18:
            _context21.next = 20;
            return _addAuthority(file, user, group, _role, res.user.tenant_id);

          case 20:
            createdAuthority = _context21.sent;

            if (!(file.is_dir === true)) {
              _context21.next = 51;
              break;
            }

            _context21.next = 24;
            return _Dir["default"].find({
              ancestor: file._id,
              depth: {
                $gte: 0
              }
            });

          case 24:
            _context21.t0 = function (d) {
              return d.descendant;
            };

            childrenDirIds = _context21.sent.map(_context21.t0);
            _context21.next = 28;
            return _File["default"].find({
              dir_id: {
                $in: childrenDirIds
              }
            });

          case 28:
            children = _context21.sent;
            _context21.t1 = _regenerator["default"].keys(children);

          case 30:
            if ((_context21.t2 = _context21.t1()).done) {
              _context21.next = 51;
              break;
            }

            idx = _context21.t2.value;
            child = children[idx];

            if (!(user !== undefined && user !== null)) {
              _context21.next = 42;
              break;
            }

            _context21.next = 36;
            return _AuthorityFile["default"].findOne({
              files: child._id,
              users: user._id,
              role_files: _role.id
            });

          case 36:
            _authority = _context21.sent;

            if (!(_authority === null)) {
              _context21.next = 40;
              break;
            }

            _context21.next = 40;
            return _addAuthority(child, user, group, _role, res.user.tenant_id);

          case 40:
            _context21.next = 49;
            break;

          case 42:
            if (!(group !== undefined && group !== null)) {
              _context21.next = 49;
              break;
            }

            _context21.next = 45;
            return _AuthorityFile["default"].findOne({
              files: child._id,
              groups: group._id,
              role_files: _role.id
            });

          case 45:
            _authority2 = _context21.sent;

            if (!(_authority2 === null)) {
              _context21.next = 49;
              break;
            }

            _context21.next = 49;
            return _addAuthority(child, user, group, _role, res.user.tenant_id);

          case 49:
            _context21.next = 30;
            break;

          case 51:
            res.json({
              status: {
                success: true
              },
              body: createdAuthority
            });
            _context21.next = 82;
            break;

          case 54:
            _context21.prev = 54;
            _context21.t3 = _context21["catch"](0);
            errors = {};
            _context21.t4 = _context21.t3;
            _context21.next = _context21.t4 === "file_id is empty" ? 60 : _context21.t4 === "file_id is invalid" ? 62 : _context21.t4 === "file is empty" ? 64 : _context21.t4 === "user is empty" ? 66 : _context21.t4 === "user_id is invalid" ? 68 : _context21.t4 === "role is empty" ? 70 : _context21.t4 === "user.type is empty" ? 72 : _context21.t4 === "group is empty" ? 74 : _context21.t4 === "role set is duplicate" ? 76 : 78;
            break;

          case 60:
            errors.file_id = "ファイルIDが空のためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 62:
            errors.file_id = "ファイルIDが不正のためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 64:
            errors.file_id = "指定されたファイルが存在しないためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 66:
            errors.user_id = "指定されたユーザが存在しないためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 68:
            errors.user_id = "ユーザIDが不正のためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 70:
            errors.role_file_id = "指定された権限が存在しないためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 72:
            errors.user = "ユーザの種類が不明です";
            return _context21.abrupt("break", 80);

          case 74:
            errors.group = "追加対象のユーザが見つかりません";
            return _context21.abrupt("break", 80);

          case 76:
            errors.role_set = "指定されたユーザ、権限は既に登録されているためファイルへの権限の追加に失敗しました";
            return _context21.abrupt("break", 80);

          case 78:
            errors.unknown = _context21.t3;
            return _context21.abrupt("break", 80);

          case 80:
            _logger["default"].error(_context21.t3);

            res.status(400).json({
              status: {
                success: false,
                message: "ファイルへの権限の追加に失敗しました",
                errors: errors
              }
            });

          case 82:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, null, [[0, 54]]);
  }));
};
/**
 * ファイルの権限を削除
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.addAuthority = addAuthority;

var _removeAuthority =
/*#__PURE__*/
function () {
  var _ref24 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee22(file_id, user_id, group_id, role_id, tenant_id) {
    var role_target, target_is_user, file, role_file, find_conditions, authority, removeResult, updatedFile;
    return _regenerator["default"].wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            if (!(user_id !== null && user_id !== undefined)) {
              _context22.next = 7;
              break;
            }

            target_is_user = true;
            _context22.next = 4;
            return _User["default"].findById(user_id);

          case 4:
            role_target = _context22.sent;
            _context22.next = 15;
            break;

          case 7:
            if (!(group_id !== null && group_id !== undefined)) {
              _context22.next = 14;
              break;
            }

            target_is_user = false;
            _context22.next = 11;
            return _Group["default"].findById(group_id);

          case 11:
            role_target = _context22.sent;
            _context22.next = 15;
            break;

          case 14:
            throw new Error("invalid user or group");

          case 15:
            _context22.next = 17;
            return _File["default"].findById(file_id);

          case 17:
            file = _context22.sent;

            if (!(file === null)) {
              _context22.next = 20;
              break;
            }

            throw "file is empty";

          case 20:
            _context22.next = 22;
            return _RoleFile["default"].findById(role_id);

          case 22:
            role_file = _context22.sent;

            if (!(role_file === null)) {
              _context22.next = 25;
              break;
            }

            throw "role is empty";

          case 25:
            if (!(role_target === null)) {
              _context22.next = 27;
              break;
            }

            throw "user or group is empty";

          case 27:
            find_conditions = target_is_user ? {
              role_files: role_file._id,
              users: role_target._id,
              files: file._id,
              is_default: {
                $ne: true
              } // default権限は削除対象外

            } : {
              role_files: role_file._id,
              groups: role_target._id,
              files: file._id
            };
            authority = _AuthorityFile["default"].findOne(find_conditions);

            if (!(authority === null)) {
              _context22.next = 31;
              break;
            }

            throw "authority is empty";

          case 31:
            _context22.next = 33;
            return authority.remove();

          case 33:
            removeResult = _context22.sent;

            if (!(removeResult.ok !== 1)) {
              _context22.next = 36;
              break;
            }

            throw "remove authority is failed";

          case 36:
            _context22.next = 38;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 38:
            updatedFile = _context22.sent;
            _context22.next = 41;
            return _elasticsearchclient["default"].createIndex(tenant_id, [updatedFile]);

          case 41:
            return _context22.abrupt("return", new Promise(function (resolve, reject) {
              return resolve({
                file: file,
                role_file: role_file,
                role_target: role_target
              });
            }));

          case 42:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22);
  }));

  return function _removeAuthority(_x50, _x51, _x52, _x53, _x54) {
    return _ref24.apply(this, arguments);
  };
}();

var removeAuthority =
/*#__PURE__*/
function () {
  var _ref25 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee23(req, res, next) {
    var file_id, _req$query3, user_id, group_id, role_id, _ref26, file, role_file, role_target, childrenDirIds, children, idx, child, _authority, _authority3, errors;

    return _regenerator["default"].wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.prev = 0;
            file_id = req.params.file_id;
            _req$query3 = req.query, user_id = _req$query3.user_id, group_id = _req$query3.group_id, role_id = _req$query3.role_id;

            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context23.next = 5;
              break;
            }

            throw "file_id is invalid";

          case 5:
            if (!(role_id === undefined || role_id === null || role_id === "")) {
              _context23.next = 7;
              break;
            }

            throw "role_id is empty";

          case 7:
            if (_mongoose["default"].Types.ObjectId.isValid(role_id)) {
              _context23.next = 9;
              break;
            }

            throw "role_id is invalid";

          case 9:
            _context23.next = 11;
            return _removeAuthority(file_id, user_id, group_id, role_id, res.user.tenant_id);

          case 11:
            _ref26 = _context23.sent;
            file = _ref26.file;
            role_file = _ref26.role_file;
            role_target = _ref26.role_target;

            if (!(file.is_dir === true)) {
              _context23.next = 45;
              break;
            }

            _context23.next = 18;
            return _Dir["default"].find({
              ancestor: file._id,
              depth: {
                $gte: 0
              }
            });

          case 18:
            _context23.t0 = function (d) {
              return d.descendant;
            };

            childrenDirIds = _context23.sent.map(_context23.t0);
            _context23.next = 22;
            return _File["default"].find({
              dir_id: {
                $in: childrenDirIds
              }
            });

          case 22:
            children = _context23.sent;
            _context23.t1 = _regenerator["default"].keys(children);

          case 24:
            if ((_context23.t2 = _context23.t1()).done) {
              _context23.next = 45;
              break;
            }

            idx = _context23.t2.value;
            child = children[idx];

            if (!(user_id !== undefined && user_id !== null)) {
              _context23.next = 36;
              break;
            }

            _context23.next = 30;
            return _AuthorityFile["default"].findOne({
              files: child._id,
              users: user_id,
              role_files: role_id
            });

          case 30:
            _authority = _context23.sent;

            if (!(_authority !== null)) {
              _context23.next = 34;
              break;
            }

            _context23.next = 34;
            return _removeAuthority(child._id, user_id, group_id, role_id, res.user.tenant_id);

          case 34:
            _context23.next = 43;
            break;

          case 36:
            if (!(group_id !== undefined && group_id !== null)) {
              _context23.next = 43;
              break;
            }

            _context23.next = 39;
            return _AuthorityFile["default"].findOne({
              files: child._id,
              groups: group_id,
              role_files: role_id
            });

          case 39:
            _authority3 = _context23.sent;

            if (!(_authority3 !== null)) {
              _context23.next = 43;
              break;
            }

            _context23.next = 43;
            return _removeAuthority(child._id, user_id, group_id, role_id, res.user.tenant_id);

          case 43:
            _context23.next = 24;
            break;

          case 45:
            res.json({
              status: {
                success: true
              },
              body: {
                role_files: role_file,
                users: role_target,
                files: file
              }
            });
            _context23.next = 80;
            break;

          case 48:
            _context23.prev = 48;
            _context23.t3 = _context23["catch"](0);
            errors = {};
            _context23.t4 = _context23.t3;
            _context23.next = _context23.t4 === "file_id is invalid" ? 54 : _context23.t4 === "user_id is empty" ? 56 : _context23.t4 === "role_id is empty" ? 58 : _context23.t4 === "user_id is invalid" ? 60 : _context23.t4 === "role_id is invalid" ? 62 : _context23.t4 === "file is empty" ? 64 : _context23.t4 === "user is empty" ? 66 : _context23.t4 === "role is empty" ? 68 : _context23.t4 === "user.type is empty" ? 70 : _context23.t4 === "authority is empty" ? 72 : _context23.t4 === "remove authority is failed" ? 74 : 77;
            break;

          case 54:
            errors.file_id = "ファイルIDが不正のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 56:
            errors.user_id = "ユーザIDが空のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 58:
            errors.role_id = "ファイル権限IDが空のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 60:
            errors.user_id = "ユーザIDが不正のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 62:
            errors.role_id = "ファイル権限IDが不正のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 64:
            errors.file_id = "指定されたファイルが存在しないためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 66:
            errors.user_id = "指定されたユーザが存在しないためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 68:
            errors.role_id = "指定されたファイル権限が存在しないためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 70:
            errors.user_type = "ユーザ種別が空のためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 72:
            errors.role = "指定された権限セットが存在しないためファイルへの権限の削除に失敗しました";
            return _context23.abrupt("break", 79);

          case 74:
            errors.remove = "原因不明のエラーで権限の削除に失敗しました";
            errors.unknown = _context23.t3;
            return _context23.abrupt("break", 79);

          case 77:
            errors.unknown = _context23.t3;
            return _context23.abrupt("break", 79);

          case 79:
            res.status(400).json({
              status: {
                success: false,
                message: "ファイルへの権限の削除に失敗しました",
                errors: errors
              }
            });

          case 80:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, null, [[0, 48]]);
  }));

  return function removeAuthority(_x55, _x56, _x57) {
    return _ref25.apply(this, arguments);
  };
}();
/**
 * ごみ箱へ移動する（削除アクション）
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.removeAuthority = removeAuthority;

var moveTrash =
/*#__PURE__*/
function () {
  var _ref27 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee24(req, res, next) {
    var file_id, tenant_id, _ref28, trash_dir_id, user, file, changedFile, changedFiles, movedDirs, movedFiles, i, _updatedFile, updatedFile, errors;

    return _regenerator["default"].wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.prev = 0;
            file_id = req.params.file_id;
            tenant_id = res.user.tenant_id;
            _context24.next = 5;
            return _Tenant["default"].findOne(tenant_id);

          case 5:
            _ref28 = _context24.sent;
            trash_dir_id = _ref28.trash_dir_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context24.next = 9;
              break;
            }

            throw "file_id is empty";

          case 9:
            _context24.next = 11;
            return _User["default"].findById(res.user._id);

          case 11:
            user = _context24.sent;
            _context24.next = 14;
            return _File["default"].findById(file_id);

          case 14:
            file = _context24.sent;

            if (!(file === null)) {
              _context24.next = 17;
              break;
            }

            throw "file is empty";

          case 17:
            if (!(user === null)) {
              _context24.next = 19;
              break;
            }

            throw "user is empty";

          case 19:
            if (!file.is_dir) {
              _context24.next = 43;
              break;
            }

            _context24.next = 22;
            return (0, _dirs.moveDir)(file._id, trash_dir_id, user, "削除");

          case 22:
            changedFiles = _context24.sent;
            changedFile = changedFiles[0]; // response用。指定されたフォルダを返す

            movedDirs = changedFiles.map(function (dir) {
              return dir._id;
            });
            _context24.next = 27;
            return _File["default"].find({
              $or: [{
                _id: {
                  $in: movedDirs
                }
              }, {
                dir_id: {
                  $in: movedDirs
                }
              }]
            });

          case 27:
            movedFiles = _context24.sent;
            _context24.t0 = _regenerator["default"].keys(movedFiles);

          case 29:
            if ((_context24.t1 = _context24.t0()).done) {
              _context24.next = 41;
              break;
            }

            i = _context24.t1.value;
            movedFiles[i].is_trash = true;
            _context24.next = 34;
            return movedFiles[i].save();

          case 34:
            _context24.next = 36;
            return _File["default"].searchFileOne({
              _id: movedFiles[i]._id
            });

          case 36:
            _updatedFile = _context24.sent;
            _context24.next = 39;
            return _elasticsearchclient["default"].syncDocument(tenant_id, _updatedFile);

          case 39:
            _context24.next = 29;
            break;

          case 41:
            _context24.next = 47;
            break;

          case 43:
            file.is_trash = true;
            _context24.next = 46;
            return moveFile(file, trash_dir_id, user, "削除");

          case 46:
            changedFile = _context24.sent;

          case 47:
            _context24.next = 49;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 49:
            updatedFile = _context24.sent;
            _context24.next = 52;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 52:
            res.json({
              status: {
                success: true
              },
              body: changedFile
            });
            _context24.next = 72;
            break;

          case 55:
            _context24.prev = 55;
            _context24.t2 = _context24["catch"](0);
            errors = {};
            _context24.t3 = _context24.t2;
            _context24.next = _context24.t3 === "file_id is empty" ? 61 : _context24.t3 === "file is empty" ? 63 : _context24.t3 === "user is empty" ? 65 : _context24.t3 === "file is dir" ? 67 : 69;
            break;

          case 61:
            errors.file_id = "削除対象のファイルが見つかりません";
            return _context24.abrupt("break", 71);

          case 63:
            errors.file = "削除対象のファイルが見つかりません";
            return _context24.abrupt("break", 71);

          case 65:
            errors.user = "実行ユーザーが見つかりません";
            return _context24.abrupt("break", 71);

          case 67:
            errors.file = "削除対象がフォルダです";
            return _context24.abrupt("break", 71);

          case 69:
            errors.unknown = _context24.t2;
            return _context24.abrupt("break", 71);

          case 71:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 72:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, null, [[0, 55]]);
  }));

  return function moveTrash(_x58, _x59, _x60) {
    return _ref27.apply(this, arguments);
  };
}();
/**
 * ？？？？？？
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.moveTrash = moveTrash;

var restore =
/*#__PURE__*/
function () {
  var _ref29 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee25(req, res, next) {
    var file_id, user, file, dir_id, changedFile, tenant_id, updatedFile, errors;
    return _regenerator["default"].wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context25.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            _context25.next = 6;
            return _User["default"].findById(res.user._id);

          case 6:
            user = _context25.sent;
            _context25.next = 9;
            return _File["default"].findById(file_id);

          case 9:
            file = _context25.sent;
            dir_id = file.histories[file.histories.length - 1].body.dir_id;

            if (!(file === null)) {
              _context25.next = 13;
              break;
            }

            throw "file is empty";

          case 13:
            if (!(user === null)) {
              _context25.next = 15;
              break;
            }

            throw "user is empty";

          case 15:
            if (!(dir_id === null || dir_id === undefined || dir_id === "")) {
              _context25.next = 17;
              break;
            }

            throw "dir_id is empty";

          case 17:
            _context25.next = 19;
            return moveFile(file, dir_id, user, "復元");

          case 19:
            changedFile = _context25.sent;
            // elasticsearch index作成
            tenant_id = res.user.tenant_id;
            _context25.next = 23;
            return _File["default"].searchFileOne({
              _id: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 23:
            updatedFile = _context25.sent;
            _context25.next = 26;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 26:
            res.json({
              status: {
                success: true
              },
              body: changedFile
            });
            _context25.next = 44;
            break;

          case 29:
            _context25.prev = 29;
            _context25.t0 = _context25["catch"](0);
            errors = {};
            _context25.t1 = _context25.t0;
            _context25.next = _context25.t1 === "file_id is empty" ? 35 : _context25.t1 === "file is empty" ? 37 : _context25.t1 === "user is empty" ? 39 : 41;
            break;

          case 35:
            errors.file_id = "対象のファイルが見つかりません";
            return _context25.abrupt("break", 43);

          case 37:
            errors.file = "対象のファイルが見つかりません";
            return _context25.abrupt("break", 43);

          case 39:
            errors.user = "実行ユーザーが見つかりません";
            return _context25.abrupt("break", 43);

          case 41:
            errors.unknown = _context25.t0;
            return _context25.abrupt("break", 43);

          case 43:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 44:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, null, [[0, 29]]);
  }));

  return function restore(_x61, _x62, _x63) {
    return _ref29.apply(this, arguments);
  };
}();
/**
 * ファイルの論理削除（ごみ箱から削除）
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.restore = restore;

var deleteFileLogical =
/*#__PURE__*/
function () {
  var _ref30 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee26(req, res, next) {
    var file_id, user, file, tenant_id, history, deletedFiles, updatedFile, errors;
    return _regenerator["default"].wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            _context26.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context26.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context26.next = 6;
              break;
            }

            throw "file_id is invalid";

          case 6:
            _context26.next = 8;
            return _User["default"].findById(res.user._id);

          case 8:
            user = _context26.sent;
            _context26.next = 11;
            return _File["default"].findById(file_id);

          case 11:
            file = _context26.sent;

            if (file) {
              _context26.next = 14;
              break;
            }

            throw "file is empty";

          case 14:
            if (!file.is_deleted) {
              _context26.next = 16;
              break;
            }

            throw "file is empty";

          case 16:
            tenant_id = res.user.tenant_id;
            history = {
              modified: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss"),
              user: user,
              action: "完全削除",
              body: {
                _id: file._id,
                is_star: file.is_star,
                is_display: file.is_display,
                dir_id: file.dir_id,
                is_dir: file.is_dir,
                size: file.size,
                mime_type: file.mime_type,
                blob_path: file.blob_path,
                name: file.name,
                meta_infos: file.meta_infos,
                tags: file.tags,
                is_deleted: file.is_deleted,
                modified: file.modified,
                __v: file.__v
              }
            };
            file.histories = file.histories.concat(history);
            // if (file.is_dir) {
            //   const deletingDirs = await Dir.find({ ancestor: file._id });
            //   const deletingDirIds = deletingDirs.map(dir => dir.descendant)
            //   const deletingFiles = await File.find({
            //     $or: [
            //       { _id: { $in: deletingDirIds } },
            //       { dir_id: { $in: deletingDirIds} }
            //     ]
            //   });
            //   for (let i in deletingFiles) {
            //     deletingFiles[i].is_deleted = true;
            //     await deletingFiles[i].save();
            //     // フォルダ内のファイルについて elasticsearch index更新
            //     const updatedFile = await File.searchFileOne({ _id: deletingFiles[i]._id });
            //     await esClient.syncDocument(tenant_id, updatedFile);
            //   }
            //   deletedFiles = deletingFiles
            // } else {
            file.is_deleted = true;
            _context26.next = 22;
            return file.save();

          case 22:
            _context26.next = 24;
            return _File["default"].searchFileOne({
              _id: file._id
            });

          case 24:
            updatedFile = _context26.sent;
            _context26.next = 27;
            return _elasticsearchclient["default"].syncDocument(tenant_id, updatedFile);

          case 27:
            deletedFiles = [updatedFile]; // }

            res.json({
              status: {
                success: true
              },
              body: deletedFiles
            });
            _context26.next = 48;
            break;

          case 31:
            _context26.prev = 31;
            _context26.t0 = _context26["catch"](0);
            errors = {};
            _context26.t1 = _context26.t0;
            _context26.next = _context26.t1 === "file_id is empty" ? 37 : _context26.t1 === "file_id is invalid" ? 39 : _context26.t1 === "file is empty" ? 41 : _context26.t1 === "user is empty" ? 43 : 45;
            break;

          case 37:
            errors.file_id = "対象のファイルが見つかりません";
            return _context26.abrupt("break", 47);

          case 39:
            errors.file_id = "ファイルIDが不正です";
            return _context26.abrupt("break", 47);

          case 41:
            errors.file = "対象のファイルが見つかりません";
            return _context26.abrupt("break", 47);

          case 43:
            errors.user = "実行ユーザーが見つかりません";
            return _context26.abrupt("break", 47);

          case 45:
            errors.unknown = _context26.t0;
            return _context26.abrupt("break", 47);

          case 47:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 48:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, null, [[0, 31]]);
  }));

  return function deleteFileLogical(_x64, _x65, _x66) {
    return _ref30.apply(this, arguments);
  };
}();
/**
 * ？？？？？？
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.deleteFileLogical = deleteFileLogical;

var deleteFilePhysical =
/*#__PURE__*/
function () {
  var _ref31 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee27(req, res, next) {
    var swift, file_id, fileRecord, tenant_name, readStream, deletedFile, deletedAutholity, tenant_id, errors;
    return _regenerator["default"].wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            _context27.prev = 0;
            // is_delete === true のみ対象ファイル
            // swiftコンテナから削除
            // mongoから削除
            swift = new _Swift.Swift();
            file_id = req.params.file_id;
            _context27.next = 5;
            return _File["default"].findById(file_id);

          case 5:
            fileRecord = _context27.sent;

            if (!(fileRecord === null)) {
              _context27.next = 8;
              break;
            }

            throw "file not found";

          case 8:
            if (!(fileRecord.is_deleted !== true)) {
              _context27.next = 10;
              break;
            }

            throw "file is not deleted";

          case 10:
            tenant_name = res.user.tenant.name;
            _context27.next = 13;
            return swift.remove(tenant_name, fileRecord);

          case 13:
            readStream = _context27.sent;
            _context27.next = 16;
            return fileRecord.remove();

          case 16:
            deletedFile = _context27.sent;
            _context27.next = 19;
            return _AuthorityFile["default"].remove({
              files: fileRecord._id
            });

          case 19:
            deletedAutholity = _context27.sent;
            // elasticsearch index削除
            tenant_id = res.user.tenant_id;
            _context27.next = 23;
            return _elasticsearchclient["default"]["delete"]({
              index: tenant_id,
              type: "files",
              id: file_id
            });

          case 23:
            res.json({
              status: {
                success: true
              },
              body: deletedFile
            });
            _context27.next = 31;
            break;

          case 26:
            _context27.prev = 26;
            _context27.t0 = _context27["catch"](0);
            errors = {};
            errors.unknown = _context27.t0;
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 31:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, null, [[0, 26]]);
  }));

  return function deleteFilePhysical(_x67, _x68, _x69) {
    return _ref31.apply(this, arguments);
  };
}();
/**
 * プレビュー画像の存在チェック
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.deleteFilePhysical = deleteFilePhysical;

var previewExists =
/*#__PURE__*/
function () {
  var _ref32 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee28(req, res, next) {
    var file_id, file, preview_id, preview, tmpDirPath, tmpFileName, tenant_name, swift, downloadFile, command, pdfFileName, changedFile, execResult, previewImage, errors;
    return _regenerator["default"].wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            _context28.prev = 0;
            // プレビュー画像の存在チェック
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context28.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            _context28.next = 6;
            return _File["default"].findById(file_id);

          case 6:
            file = _context28.sent;

            if (!(file.size > constants.MAX_CREATE_PREVIEW_FILE_SIZE)) {
              _context28.next = 9;
              break;
            }

            throw "file size is too large";

          case 9:
            preview_id = file.preview_id;

            if (!(preview_id === null || preview_id === undefined || preview_id === "")) {
              _context28.next = 14;
              break;
            }

            preview = new _Preview["default"]();
            _context28.next = 17;
            break;

          case 14:
            _context28.next = 16;
            return _Preview["default"].findById(preview_id);

          case 16:
            preview = _context28.sent;

          case 17:
            if (!(preview.image === undefined && preview.creating === false)) {
              _context28.next = 69;
              break;
            }

            tmpDirPath = _path["default"].join(__dirname, '../../tmp');
            tmpFileName = _path["default"].join(tmpDirPath, file.name);

            _fs["default"].mkdir(tmpDirPath, function (err) {
              if (err && err.code !== "EEXIST") _logger["default"].info(err);
            });

            tenant_name = res.user.tenant.name;
            swift = new _Swift.Swift();
            _context28.next = 25;
            return swift.exportFile(tenant_name, file, tmpFileName);

          case 25:
            downloadFile = _context28.sent;
            command = '';
            _context28.t0 = file.mime_type;
            _context28.next = _context28.t0 === "text/csv" ? 30 : _context28.t0 === "text/plain" ? 30 : _context28.t0 === "application/msword" ? 32 : _context28.t0 === "application/vnd.ms-excel" ? 32 : _context28.t0 === "application/vnd.ms-powerpoint" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.wordprocessingml.template" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.spreadsheetml.template" ? 32 : _context28.t0 === "application/vnd.openxmlformats-officedocument.presentationml.template" ? 32 : _context28.t0 === "application/pdf" ? 35 : _context28.t0 === "image/jpeg" ? 37 : _context28.t0 === "image/png" ? 37 : _context28.t0 === "image/gif" ? 37 : _context28.t0 === "image/tiff" ? 37 : 39;
            break;

          case 30:
            // csv,txtファイルはnkfでUTF8に変換後,PDFを経てpng形式に変換する
            command = "cd ".concat(tmpDirPath, " && nkf -w \"").concat(file.name, "\" > buf.txt && ").concat(constants.LIBRE_OFFICE_PATH(), " --headless --nologo --nofirststartwizard --convert-to pdf buf.txt && convert -background white -alpha remove -density ").concat(constants.CONVERT_DPI, " -antialias -format png buf.pdf[0] \"").concat(file.name, ".png\" && rm \"").concat(file.name, "\" buf.*");
            return _context28.abrupt("break", 41);

          case 32:
            pdfFileName = _path["default"].extname(file.name) === "" ? file.name + ".pdf" : file.name.replace(_path["default"].extname(file.name), ".pdf");
            command = "cd ".concat(tmpDirPath, " && ").concat(constants.LIBRE_OFFICE_PATH(), " --headless --nologo --nofirststartwizard --convert-to pdf \"").concat(file.name, "\" && convert -background white -alpha remove -density ").concat(constants.CONVERT_DPI, " -antialias -format png \"").concat(pdfFileName, "[0]\" \"").concat(file.name, ".png\" && rm \"").concat(file.name, "\" \"").concat(pdfFileName, "\"");
            return _context28.abrupt("break", 41);

          case 35:
            command = "cd ".concat(tmpDirPath, " && convert -background white -alpha remove -density ").concat(constants.CONVERT_DPI, " -antialias -format png \"").concat(file.name, "[0]\" \"").concat(file.name, ".png\" && rm \"").concat(file.name, "\"");
            return _context28.abrupt("break", 41);

          case 37:
            command = "cd ".concat(tmpDirPath, " && convert -density ").concat(constants.CONVERT_DPI, " -antialias -format png \"").concat(file.name, "\" -resize 1024x\\> \"").concat(file.name, ".png\" && rm \"").concat(file.name, "\"");
            return _context28.abrupt("break", 41);

          case 39:
            throw "this mime_type is not supported yet";

          case 41:
            if (!(command !== "")) {
              _context28.next = 67;
              break;
            }

            preview.creating = true; // 大きいファイルの場合、タイムアウトするので一度idだけ登録してコマンドの再実行を防止する

            _context28.next = 45;
            return preview.save();

          case 45:
            file.preview_id = preview._id;
            _context28.next = 48;
            return file.save();

          case 48:
            changedFile = _context28.sent;
            _context28.prev = 49;
            _context28.next = 52;
            return _exec(command);

          case 52:
            execResult = _context28.sent;
            preview.image = _fs["default"].readFileSync("".concat(tmpFileName, ".png"));
            _context28.next = 59;
            break;

          case 56:
            _context28.prev = 56;
            _context28.t1 = _context28["catch"](49);
            throw _context28.t1;

          case 59:
            _context28.prev = 59;
            preview.creating = false;
            _context28.next = 63;
            return preview.save();

          case 63:
            previewImage = _context28.sent;
            return _context28.finish(59);

          case 65:
            preview_id = file.preview_id;

            _fs["default"].unlinkSync(_path["default"].join("".concat(tmpFileName, ".png")));

          case 67:
            _context28.next = 70;
            break;

          case 69:
            if (preview.image === undefined) preview_id = null;

          case 70:
            res.json({
              status: {
                success: true
              },
              body: {
                preview_id: preview_id
              }
            });
            _context28.next = 87;
            break;

          case 73:
            _context28.prev = 73;
            _context28.t2 = _context28["catch"](0);

            _logger["default"].error(_context28.t2);

            errors = {};
            _context28.t3 = _context28.t2;
            _context28.next = _context28.t3 === "this mime_type is not supported yet" ? 80 : _context28.t3 === "file size is too large" ? 82 : 84;
            break;

          case 80:
            errors.mime_type = "このファイルはプレビュー画像を表示できません";
            return _context28.abrupt("break", 86);

          case 82:
            errors.file_size = "このファイルはプレビュー画像を表示できません";
            return _context28.abrupt("break", 86);

          case 84:
            errors.unknown = _context28.t2;
            return _context28.abrupt("break", 86);

          case 86:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 87:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, null, [[0, 73], [49, 56, 59, 65]]);
  }));

  return function previewExists(_x70, _x71, _x72) {
    return _ref32.apply(this, arguments);
  };
}();
/**
 * ？？？？？？
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.previewExists = previewExists;

var exists =
/*#__PURE__*/
function () {
  var _ref33 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee29(req, res, next) {
    var _req$body4, dir_id, files, fileNames, records, _exists, errors;

    return _regenerator["default"].wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _context29.prev = 0;
            _req$body4 = req.body, dir_id = _req$body4.dir_id, files = _req$body4.files;

            if (!(dir_id === null || dir_id === undefined || dir_id === "")) {
              _context29.next = 4;
              break;
            }

            throw new _AppError.ValidationError("dir_idが空です");

          case 4:
            if (files === null || files === undefined || files === "" || files.length === 0) {
              // validationErrorではなく空で返却するのが正解？
              res.json({
                status: {
                  success: true
                },
                body: []
              });
            }

            fileNames = (0, _.reject)(files.map(function (f) {
              return f.name;
            }), function (name) {
              return name === undefined || name === null || name === "" || name === "undefined";
            });

            if (!(files.length !== fileNames.length)) {
              _context29.next = 8;
              break;
            }

            throw new _AppError.ValidationError("ファイル名に空のものが存在します");

          case 8:
            _context29.next = 10;
            return files.map(function (file) {
              return _File["default"].findOne({
                dir_id: _mongoose["default"].Types.ObjectId(dir_id),
                name: file.name
              });
            });

          case 10:
            records = _context29.sent;
            _exists = (0, _.zipWith)(records, files, function (record, file) {
              if (record === null) {
                return {
                  name: file.name,
                  is_exists: false
                };
              } else {
                return {
                  name: record.name,
                  is_exists: true
                };
              }
            });
            res.json({
              status: {
                success: true
              },
              body: _exists
            });
            _context29.next = 19;
            break;

          case 15:
            _context29.prev = 15;
            _context29.t0 = _context29["catch"](0);

            if (_context29.t0.name === "Error") {
              errors = commons.errorParser(_context29.t0);
            } else {
              errors = _context29.t0;
            }

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 19:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, null, [[0, 15]]);
  }));

  return function exists(_x73, _x74, _x75) {
    return _ref33.apply(this, arguments);
  };
}();
/**
 * ？？？？？？
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */


exports.exists = exists;

var toggleUnvisible =
/*#__PURE__*/
function () {
  var _ref34 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee30(req, res, next) {
    var file_id, tenant_id, tenant, file, result, esFile, errors;
    return _regenerator["default"].wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            file_id = req.params.file_id;
            _context30.prev = 1;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context30.next = 4;
              break;
            }

            throw new Error("ファイルが存在しないため非表示状態の変更に失敗しました");

          case 4:
            tenant_id = res.user.tenant_id;
            _context30.next = 7;
            return _Tenant["default"].findById(tenant_id);

          case 7:
            tenant = _context30.sent;

            if (!(tenant === null)) {
              _context30.next = 10;
              break;
            }

            throw new Error("指定されたテナントが存在しないため非表示状態の変更に失敗しました");

          case 10:
            _context30.next = 12;
            return _File["default"].findById(file_id);

          case 12:
            file = _context30.sent;
            file.unvisible = !file.unvisible;
            _context30.next = 16;
            return file.save();

          case 16:
            result = _context30.sent;

            if (result) {
              _context30.next = 19;
              break;
            }

            throw new Error("ファイルの非表示状態の変更に失敗しました");

          case 19:
            _context30.next = 21;
            return _File["default"].searchFileOne({
              _id: result._id
            });

          case 21:
            esFile = _context30.sent;
            _context30.next = 24;
            return _elasticsearchclient["default"].syncDocument(tenant_id, esFile);

          case 24:
            res.json({
              status: {
                success: true
              },
              body: result
            });
            _context30.next = 30;
            break;

          case 27:
            _context30.prev = 27;
            _context30.t0 = _context30["catch"](1);
            res.status(400).json({
              status: {
                success: false
              }
            });

          case 30:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, null, [[1, 27]]);
  }));

  return function toggleUnvisible(_x76, _x77, _x78) {
    return _ref34.apply(this, arguments);
  };
}(); // ここからプライベート的なメソッド


exports.toggleUnvisible = toggleUnvisible;

var _exec = function _exec(command) {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)(command, function (err, stdout, stderr) {
      if (err) return reject({
        err: err,
        stderr: stderr
      });
      return resolve(true);
    });
  });
};

var moveFile =
/*#__PURE__*/
function () {
  var _ref35 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee31(file, dir_id, user, action) {
    var history, changedFile;
    return _regenerator["default"].wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            if (!file.is_dir) {
              _context31.next = 2;
              break;
            }

            throw "file is dir";

          case 2:
            history = {
              modified: (0, _moment["default"])().format("YYYY-MM-DD hh:mm:ss"),
              user: user,
              action: action,
              body: {
                _id: file._id,
                is_star: file.is_star,
                is_display: file.is_display,
                dir_id: file.dir_id,
                is_dir: file.is_dir,
                size: file.size,
                mime_type: file.mime_type,
                blob_path: file.blob_path,
                name: file.name,
                meta_infos: file.meta_infos,
                tags: file.tags,
                is_deleted: file.is_deleted,
                modified: file.modified,
                __v: file.__v
              }
            };
            file.histories = file.histories.concat(history);
            file.dir_id = dir_id;
            _context31.next = 7;
            return file.save();

          case 7:
            changedFile = _context31.sent;
            return _context31.abrupt("return", changedFile);

          case 9:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31);
  }));

  return function moveFile(_x79, _x80, _x81, _x82) {
    return _ref35.apply(this, arguments);
  };
}();

var createSortOption =
/*#__PURE__*/
function () {
  var _ref36 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee32() {
    var _sort,
        _order,
        sort,
        order,
        conditions,
        metaInfos,
        displayItems,
        item,
        _args32 = arguments;

    return _regenerator["default"].wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _sort = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : null;
            _order = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : null;
            sort = {
              "is_dir": "desc"
            };
            order = _order === "DESC" || _order === "desc" ? -1 : 1;

            if (!(_sort === undefined || _sort === null || _sort === "")) {
              _context32.next = 8;
              break;
            }

            sort["id"] = order;
            _context32.next = 23;
            break;

          case 8:
            if (!_mongoose["default"].Types.ObjectId.isValid(_sort)) {
              _context32.next = 22;
              break;
            }

            conditions = {
              _id: _mongoose["default"].Types.ObjectId(_sort)
            };
            _context32.next = 12;
            return _MetaInfo["default"].find(conditions);

          case 12:
            _context32.t0 = function (meta) {
              meta = meta.toObject();
              meta.meta_info_id = meta._id;
              return meta;
            };

            metaInfos = _context32.sent.map(_context32.t0);
            _context32.next = 16;
            return _DisplayItem["default"].find(_objectSpread({}, conditions, {
              name: {
                $nin: ["file_checkbox", "action"]
              }
            }));

          case 16:
            _context32.t1 = function (items) {
              return items.toObject();
            };

            displayItems = _context32.sent.map(_context32.t1);
            item = metaInfos.concat(displayItems)[0];

            if (item.meta_info_id === null) {
              // メタ情報以外でのソート
              sort[item.name] = order;
            } else if (item.meta_info_id !== null) {
              // メタ情報でのソート
              sort = (0, _defineProperty2["default"])({
                "is_dir": "desc"
              }, _sort, order);
            } else {
              // @fixme
              sort["id"] = order;
            }

            _context32.next = 23;
            break;

          case 22:
            sort[_sort] = order;

          case 23:
            sort["name"] = order;
            return _context32.abrupt("return", Promise.resolve(sort));

          case 25:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));

  return function createSortOption() {
    return _ref36.apply(this, arguments);
  };
}();

var getAllowedFileIds =
/*#__PURE__*/
function () {
  var _ref37 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee33(user_id, permission) {
    var action, role, user, authorities, file_ids;
    return _regenerator["default"].wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return _Action["default"].findOne({
              name: permission
            });

          case 2:
            action = _context33.sent;
            _context33.next = 5;
            return _RoleFile["default"].find({
              actions: {
                $all: [action._id]
              }
            }, {
              '_id': 1
            });

          case 5:
            _context33.t0 = function (role) {
              return _mongoose["default"].Types.ObjectId(role._id);
            };

            role = _context33.sent.map(_context33.t0);
            _context33.next = 9;
            return _User["default"].findById(user_id);

          case 9:
            user = _context33.sent;
            _context33.next = 12;
            return _AuthorityFile["default"].find({
              $or: [{
                users: _mongoose["default"].Types.ObjectId(user_id)
              }, {
                groups: {
                  $in: user.groups
                }
              }],
              role_files: {
                $in: role
              }
            });

          case 12:
            authorities = _context33.sent;
            file_ids = authorities.filter(function (authority) {
              return authority.files !== undefined;
            }).map(function (authority) {
              return authority.files;
            });
            return _context33.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(file_ids);
            }));

          case 15:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));

  return function getAllowedFileIds(_x83, _x84) {
    return _ref37.apply(this, arguments);
  };
}();

exports.getAllowedFileIds = getAllowedFileIds;

var isAllowedFileId =
/*#__PURE__*/
function () {
  var _ref38 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee34(file_id, user_id, permission) {
    var action, role, user, authorities, file_ids, result;
    return _regenerator["default"].wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return _Action["default"].findOne({
              name: permission
            });

          case 2:
            action = _context34.sent;
            _context34.next = 5;
            return _RoleFile["default"].find({
              actions: {
                $all: [action._id]
              }
            }, {
              '_id': 1
            });

          case 5:
            _context34.t0 = function (role) {
              return _mongoose["default"].Types.ObjectId(role._id);
            };

            role = _context34.sent.map(_context34.t0);
            _context34.next = 9;
            return _User["default"].findById(user_id);

          case 9:
            user = _context34.sent;
            _context34.next = 12;
            return _AuthorityFile["default"].find({
              $or: [{
                users: _mongoose["default"].Types.ObjectId(user_id)
              }, {
                groups: {
                  $in: user.groups
                }
              }],
              role_files: {
                $in: role
              },
              files: _mongoose["default"].Types.ObjectId(file_id)
            });

          case 12:
            authorities = _context34.sent;
            file_ids = authorities.filter(function (authority) {
              return authority.files !== undefined;
            }).map(function (authority) {
              return authority.files;
            });
            result = file_ids && file_ids.length > 0 ? true : false;
            return _context34.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(result);
            }));

          case 16:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34);
  }));

  return function isAllowedFileId(_x85, _x86, _x87) {
    return _ref38.apply(this, arguments);
  };
}();
/**
 * ファイルに対するアクションの権限があるかどうかを判断する
 * @param {*} file_id
 * @param {*} user_id
 * @param {*} permission
 */


exports.isAllowedFileId = isAllowedFileId;

var checkFilePermission =
/*#__PURE__*/
function () {
  var _ref39 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee35(file_id, user_id, permission) {
    var action, role, user, authorities;
    return _regenerator["default"].wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.next = 2;
            return _Action["default"].findOne({
              name: permission
            });

          case 2:
            action = _context35.sent;
            _context35.next = 5;
            return _RoleFile["default"].find({
              actions: {
                $all: [action._id]
              }
            }, {
              '_id': 1
            });

          case 5:
            _context35.t0 = function (role) {
              return _mongoose["default"].Types.ObjectId(role._id);
            };

            role = _context35.sent.map(_context35.t0);
            _context35.next = 9;
            return _User["default"].findById(user_id);

          case 9:
            user = _context35.sent;
            _context35.next = 12;
            return _AuthorityFile["default"].find({
              $or: [{
                users: _mongoose["default"].Types.ObjectId(user_id)
              }, {
                groups: {
                  $in: user.groups
                }
              }],
              role_files: {
                $in: role
              },
              files: file_id
            });

          case 12:
            authorities = _context35.sent;
            return _context35.abrupt("return", new Promise(function (resolve, reject) {
              return resolve(authorities.length > 0);
            }));

          case 14:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35);
  }));

  return function checkFilePermission(_x88, _x89, _x90) {
    return _ref39.apply(this, arguments);
  };
}();

exports.checkFilePermission = checkFilePermission;

var escapeRegExp = function escapeRegExp(input) {
  var replace_target = {
    '\\': '\\\\',
    '^': '\\^',
    '$': '\\$',
    '.': '\\.',
    '*': '\\*',
    '+': '\\+',
    '?': '\\?',
    '[': '\\[',
    ']': '\\]',
    '{': '\\{',
    '}': '\\}',
    '(': '\\(',
    ')': '\\)',
    '/': '\\/'
  };
  return input.replace(/[\^\$\.\*\+\?\[\]\{\}\(\)\/]/g, function (m) {
    return replace_target[m];
  });
};

var extractFileActions = function extractFileActions(authorities, user) {
  var user_id = user._id.toString();

  var user_actions = (0, _.chain)(authorities).filter(function (auth) {
    return auth.users !== undefined && auth.users._id.toString() == user_id;
  }).map(function (auth) {
    return auth.actions;
  }).flattenDeep().uniq().value();
  var group_ids = user.groups.map(function (group) {
    return group.toString();
  });
  var group_actuions = (0, _.chain)(authorities).filter(function (auth) {
    return auth.groups !== undefined && (0, _.indexOf)(group_ids, auth.groups._id.toString()) >= 0;
  }).map(function (auth) {
    return auth.actions;
  }).flattenDeep().uniq().value();
  return user_actions.concat(group_actuions);
};

exports.extractFileActions = extractFileActions;