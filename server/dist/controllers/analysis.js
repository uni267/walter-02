"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.periods = exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _co = _interopRequireDefault(require("co"));

var _util = _interopRequireDefault(require("util"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _moment = _interopRequireDefault(require("moment"));

var _ = _interopRequireWildcard(require("lodash"));

var _AnalysisUseRateTotal = _interopRequireDefault(require("../models/AnalysisUseRateTotal"));

var _AnalysisFileCount = _interopRequireDefault(require("../models/AnalysisFileCount"));

var _AnalysisFolderCount = _interopRequireDefault(require("../models/AnalysisFolderCount"));

var _AnalysisUseRateFolder = _interopRequireDefault(require("../models/AnalysisUseRateFolder"));

var _AnalysisUseRateTag = _interopRequireDefault(require("../models/AnalysisUseRateTag"));

var _AnalysisUseRateMimeType = _interopRequireDefault(require("../models/AnalysisUseRateMimeType"));

var _AnalysisUseRateUser = _interopRequireDefault(require("../models/AnalysisUseRateUser"));

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var reported_at, conditions, _ref, _ref2, useRateTotal, fileCount, folderCount, useRateFolder, useRateTag, useRateMimeType, useRateUser, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            reported_at = req.query.reported_at;

            if (!(reported_at === undefined || reported_at === null || reported_at === "")) {
              _context.next = 4;
              break;
            }

            throw "reported_at is empty";

          case 4:
            if ((0, _moment["default"])(reported_at, "YYYYMMDD")) {
              _context.next = 6;
              break;
            }

            throw "reported_at is invalid";

          case 6:
            if (!((0, _moment["default"])(reported_at, "YYYYMMDD").format() > (0, _moment["default"])().format())) {
              _context.next = 8;
              break;
            }

            throw "reported_at is invalid";

          case 8:
            conditions = {
              tenant_id: res.user.tenant_id,
              reported_at: reported_at
            };
            _context.next = 11;
            return [_AnalysisUseRateTotal["default"].find(conditions), _AnalysisFileCount["default"].find(conditions), _AnalysisFolderCount["default"].find(conditions), _AnalysisUseRateFolder["default"].find(conditions), _AnalysisUseRateTag["default"].find(conditions), _AnalysisUseRateMimeType["default"].find(conditions), _AnalysisUseRateUser["default"].find(conditions)];

          case 11:
            _ref = _context.sent;
            _ref2 = (0, _slicedToArray2["default"])(_ref, 7);
            useRateTotal = _ref2[0];
            fileCount = _ref2[1];
            folderCount = _ref2[2];
            useRateFolder = _ref2[3];
            useRateTag = _ref2[4];
            useRateMimeType = _ref2[5];
            useRateUser = _ref2[6];

            if (useRateTotal.length > 0) {
              useRateTotal = [{
                name: "usage",
                label: "使用容量",
                value: useRateTotal[0].used
              }, {
                name: "free",
                label: "空き容量",
                value: useRateTotal[0].free
              }];
            }

            if (fileCount.length > 0) {
              fileCount = [{
                name: "fileCount",
                value: fileCount[0].count
              }];
            }

            if (folderCount.length > 0) {
              folderCount = [{
                name: "folderCount",
                value: folderCount[0].count
              }];
            }

            if (useRateFolder.length > 0) {
              useRateFolder = useRateFolder.map(function (f) {
                return {
                  name: f.dir_name,
                  value: f.rate
                };
              });
            }

            if (useRateTag.length > 0) {
              useRateTag = useRateTag.map(function (t) {
                if (t.tag_label === null) {
                  t.tag_label = "タグなし";
                }

                return {
                  name: t.tag_label,
                  value: t.rate
                };
              });
            }

            if (useRateMimeType.length > 0) {
              useRateMimeType = useRateMimeType.map(function (m) {
                return {
                  name: m.mime_type,
                  value: m.rate
                };
              });
            }

            if (useRateUser.length > 0) {
              useRateUser = useRateUser.map(function (user) {
                return {
                  name: user.user_name,
                  value: user.rate
                };
              });
            }

            res.json({
              status: {
                success: true
              },
              body: {
                useRateTotal: useRateTotal,
                fileCount: fileCount,
                folderCount: folderCount,
                useRateFolder: useRateFolder,
                useRateTag: useRateTag,
                useRateMimeType: useRateMimeType,
                useRateUser: useRateUser
              }
            });
            _context.next = 43;
            break;

          case 30:
            _context.prev = 30;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "reported_at is empty" ? 36 : _context.t1 === "reported_at is invalid" ? 38 : 40;
            break;

          case 36:
            errors.reported_at = "日付が空のため容量の履歴の取得に失敗しました";
            return _context.abrupt("break", 42);

          case 38:
            errors.reported_at = "日付が不正のため容量の履歴の取得に失敗しました";
            return _context.abrupt("break", 42);

          case 40:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 42);

          case 42:
            res.status(400).json({
              status: {
                success: false,
                message: "容量の履歴の取得に失敗しました",
                errors: errors
              }
            });

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 30]]);
  }));
};

exports.index = index;

var periods = function periods(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var _req$query, start_date, end_date, conditions, usages, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$query = req.query, start_date = _req$query.start_date, end_date = _req$query.end_date;

            if (!(start_date === undefined || start_date === null || start_date === "")) {
              _context2.next = 4;
              break;
            }

            throw "start_date is empty";

          case 4:
            if (!(end_date === undefined || end_date === null || end_date === "")) {
              _context2.next = 6;
              break;
            }

            throw "end_date is empty";

          case 6:
            if (!((0, _moment["default"])(start_date, "YYYYMMDD").format() > (0, _moment["default"])(end_date, "YYYYMMDD").format())) {
              _context2.next = 8;
              break;
            }

            throw "date_range is invalid";

          case 8:
            conditions = {
              tenant_id: res.user.tenant_id,
              $and: [{
                reported_at: {
                  $gte: start_date
                }
              }, {
                reported_at: {
                  $lte: end_date
                }
              }]
            };
            _context2.next = 11;
            return _AnalysisUseRateTotal["default"].find(conditions).sort({
              reported_at: 1
            });

          case 11:
            usages = _context2.sent;

            if (usages.length > 0) {
              usages = usages.map(function (total) {
                return {
                  name: (0, _moment["default"])(total.reported_at, "YYYYMMDD").format("YYYY-MM-DD"),
                  usage: total.used / 1024 / 1024 / 1024,
                  // GB
                  free: total.free / 1024 / 1024 / 1024 // GB

                };
              });
            }

            res.json({
              status: {
                success: true
              },
              body: usages
            });
            _context2.next = 29;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0;
            _context2.next = _context2.t1 === "start_date is empty" ? 22 : _context2.t1 === "end_date is empty" ? 24 : 26;
            break;

          case 22:
            errors.start_date = "開始年月日が空のため容量の履歴の取得に失敗しました";
            return _context2.abrupt("break", 28);

          case 24:
            errors.end_date = "終了年月日が空のため容量の履歴の取得に失敗しました";
            return _context2.abrupt("break", 28);

          case 26:
            errors.unknown = _context2.t0;
            return _context2.abrupt("break", 28);

          case 28:
            res.status(400).json({
              status: {
                success: false,
                message: "容量の履歴の取得に失敗しました",
                errors: errors
              }
            });

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 16]]);
  }));
};

exports.periods = periods;