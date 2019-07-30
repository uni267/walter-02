"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reIndexAll = exports.reIndexSearchResult = exports.reIndex = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _elasticsearchclient = _interopRequireDefault(require("../elasticsearchclient"));

var _logger = _interopRequireDefault(require("../logger"));

var _AppError = require("../errors/AppError");

var commons = _interopRequireWildcard(require("./commons"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _File = _interopRequireDefault(require("../models/File"));

var filesController = _interopRequireWildcard(require("./files"));

// etc
// models
// controllers
var reIndex = function reIndex(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var params, sortOption, targetIds, conditions, files, tenant_id, result, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            params = req.body;
            sortOption = {
              _id: "asc"
            };
            targetIds = params._id.filter(function (id) {
              return _mongoose["default"].Types.ObjectId.isValid(id);
            }).map(function (id) {
              return _mongoose["default"].Types.ObjectId(id);
            });

            if (!(targetIds.length === 0)) {
              _context.next = 6;
              break;
            }

            throw new _AppError.ValidationError("Error");

          case 6:
            // mongoからデータを取得
            conditions = {
              _id: {
                $in: targetIds
              },
              is_display: true
            };
            _context.next = 9;
            return _File["default"].searchFiles(conditions, 0, constants.FILE_LIMITS_PER_PAGE, sortOption);

          case 9:
            files = _context.sent;

            if (!(files.length === 0)) {
              _context.next = 12;
              break;
            }

            throw new _AppError.RecordNotFoundException("record not found");

          case 12:
            // elasticsearchのインデックス更新
            tenant_id = res.user.tenant_id;
            _context.next = 15;
            return _elasticsearchclient["default"].createIndex(tenant_id, files);

          case 15:
            result = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: result
            });
            _context.next = 33;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0.name;
            _context.next = _context.t1 === "Error" ? 25 : _context.t1 === "record not found" ? 27 : 29;
            break;

          case 25:
            errors = commons.errorParser(_context.t0);
            return _context.abrupt("break", 31);

          case 27:
            errors = commons.errorParser(_context.t0);
            return _context.abrupt("break", 31);

          case 29:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 31);

          case 31:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19]]);
  }));
};

exports.reIndex = reIndex;

var reIndexSearchResult = function reIndexSearchResult(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var files, tenant_id, result, errors;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return filesController.searchDetail(req, res, next, true);

          case 3:
            files = _context2.sent;

            if (!(files.length === 0)) {
              _context2.next = 6;
              break;
            }

            throw new _AppError.RecordNotFoundException("record not found");

          case 6:
            // elasticsearchのインデックス更新
            tenant_id = res.user.tenant_id;
            _context2.next = 9;
            return _elasticsearchclient["default"].createIndex(tenant_id, files);

          case 9:
            result = _context2.sent;
            res.json({
              status: {
                success: true
              },
              body: result
            });
            _context2.next = 27;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0.name;
            _context2.next = _context2.t1 === "Error" ? 19 : _context2.t1 === "record not found" ? 21 : 23;
            break;

          case 19:
            errors = commons.errorParser(_context2.t0);
            return _context2.abrupt("break", 25);

          case 21:
            errors = commons.errorParser(_context2.t0);
            return _context2.abrupt("break", 25);

          case 23:
            errors.unknown = _context2.t0;
            return _context2.abrupt("break", 25);

          case 25:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 13]]);
  }));
};

exports.reIndexSearchResult = reIndexSearchResult;

var reIndexAll = function reIndexAll(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var tenant_id, total, ct, sortOption, i, fileIds, conditions, files, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            // 検索
            _logger["default"].info(process.memoryUsage());

            tenant_id = res.user.tenant_id;
            _context3.next = 5;
            return _File["default"].find().count();

          case 5:
            total = _context3.sent;

            _logger["default"].info({
              total: total
            }); // mongoからデータを取得


            ct = 0;
            sortOption = {
              _id: "asc"
            };
            i = 0;

          case 10:
            if (!(i < total)) {
              _context3.next = 28;
              break;
            }

            _context3.next = 13;
            return _File["default"].find().select({
              _id: 1
            }).sort(sortOption).skip(i).limit(constants.FILE_LIMITS_PER_PAGE);

          case 13:
            _context3.t0 = function (file) {
              return file._id;
            };

            fileIds = _context3.sent.map(_context3.t0);
            conditions = {
              _id: {
                $in: fileIds
              },
              is_display: true
            };
            _context3.next = 18;
            return _File["default"].searchFiles(conditions, 0, constants.FILE_LIMITS_PER_PAGE, sortOption);

          case 18:
            files = _context3.sent;

            if (!(files.length <= 0)) {
              _context3.next = 21;
              break;
            }

            return _context3.abrupt("break", 28);

          case 21:
            ct += files.length;
            _context3.next = 24;
            return _elasticsearchclient["default"].createIndex(tenant_id, files);

          case 24:
            _logger["default"].info("reindex ".concat(ct, "\u4EF6\u76EE memory usage:"), process.memoryUsage().rss);

          case 25:
            i = i + constants.FILE_LIMITS_PER_PAGE;
            _context3.next = 10;
            break;

          case 28:
            _logger["default"].info("reindex complete!");

            res.json({
              status: {
                success: true
              },
              body: {}
            });
            _context3.next = 46;
            break;

          case 32:
            _context3.prev = 32;
            _context3.t1 = _context3["catch"](0);
            errors = {};
            _context3.t2 = _context3.t1.name;
            _context3.next = _context3.t2 === "Error" ? 38 : _context3.t2 === "record not found" ? 40 : 42;
            break;

          case 38:
            errors = commons.errorParser(_context3.t1);
            return _context3.abrupt("break", 44);

          case 40:
            errors = commons.errorParser(_context3.t1);
            return _context3.abrupt("break", 44);

          case 42:
            errors.unknown = _context3.t1;
            return _context3.abrupt("break", 44);

          case 44:
            _logger["default"].error(errors);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 46:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 32]]);
  }));
};

exports.reIndexAll = reIndexAll;