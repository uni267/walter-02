"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _mongoose = require("mongoose");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _logger = require("../../logger");

var _logger2 = _interopRequireDefault(_logger);

var _Tenant = require("../../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _Dir = require("../../models/Dir");

var _Dir2 = _interopRequireDefault(_Dir);

var _File = require("../../models/File");

var _File2 = _interopRequireDefault(_File);

var _Tag = require("../../models/Tag");

var _Tag2 = _interopRequireDefault(_Tag);

var _AnalysisUseRateTotal = require("../../models/AnalysisUseRateTotal");

var _AnalysisUseRateTotal2 = _interopRequireDefault(_AnalysisUseRateTotal);

var _AnalysisFileCount = require("../../models/AnalysisFileCount");

var _AnalysisFileCount2 = _interopRequireDefault(_AnalysisFileCount);

var _AnalysisFolderCount = require("../../models/AnalysisFolderCount");

var _AnalysisFolderCount2 = _interopRequireDefault(_AnalysisFolderCount);

var _AnalysisUseRateFolder = require("../../models/AnalysisUseRateFolder");

var _AnalysisUseRateFolder2 = _interopRequireDefault(_AnalysisUseRateFolder);

var _AnalysisUseRateTag = require("../../models/AnalysisUseRateTag");

var _AnalysisUseRateTag2 = _interopRequireDefault(_AnalysisUseRateTag);

var _AnalysisUseRateMimeType = require("../../models/AnalysisUseRateMimeType");

var _AnalysisUseRateMimeType2 = _interopRequireDefault(_AnalysisUseRateMimeType);

var _AnalysisUseRateUser = require("../../models/AnalysisUseRateUser");

var _AnalysisUseRateUser2 = _interopRequireDefault(_AnalysisUseRateUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// logger
var task = function task() {
  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var fileFolderCounts, folderRatesConditions, folderRates, folderRatesSum, folderRatesCombined, userRatesConditions, userRates, userRatesSumConditions, userRatesSum, userRatesRecords, tagRatesConditions, tagRates, tagRatesGroupByTenants, tagRatesCombined, mimeRatesConditions, mimeRates, mimeRatesGroupByTenants, mimeRatesCombined;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _logger2.default.info("################# analyze start #################");

            // 使用率、ファイル数、フォルダ数
            _context.next = 4;
            return _File2.default.aggregate([{
              $match: {
                is_display: true,
                is_dir: false,
                is_deleted: false
              }
            }, {
              $group: {
                _id: "$dir_id",
                used: { $sum: "$size" },
                fileCount: { $sum: 1 }
              }
            }, {
              $lookup: {
                from: "dirs",
                localField: "_id",
                foreignField: "descendant",
                as: "dirs"
              }
            }, { $unwind: "$dirs" }, {
              $lookup: {
                from: "tenants",
                localField: "dirs.ancestor",
                foreignField: "home_dir_id",
                as: "tenants"
              }
            }, {
              $match: { tenants: { $ne: [] } }
            }, {
              $project: {
                _id: 0,
                dir_id: "$_id",
                used: 1,
                fileCount: 1,
                tenant: { $arrayElemAt: ["$tenants", 0] }
              }
            }, {
              // テナントidで畳みこみ
              $group: {
                _id: "$tenant._id",
                tenantId: { $first: "$tenant._id" },
                tenantName: { $first: "$tenant.name" },
                threshold: { $first: "$tenant.threshold" },
                used: { $sum: "$used" },
                fileCount: { $sum: "$fileCount" },
                folderCount: { $sum: 1 }
              }
            }]);

          case 4:
            fileFolderCounts = _context.sent;


            _logger2.default.info("fileFolderCounts summary: " + JSON.stringify(fileFolderCounts));

            // 2重集計防止
            _context.next = 8;
            return _AnalysisUseRateTotal2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 8:
            _context.next = 10;
            return _AnalysisUseRateTotal2.default.insertMany(fileFolderCounts.map(function (f) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(f.tenantId),
                name: "useRateTotal",
                label: "全体の使用率",
                threshold: f.threshold,
                used: f.used,
                free: f.threshold - f.used,
                used_rate: (f.used / f.threshold * 100).toFixed(2)
              };
            }));

          case 10:
            _context.next = 12;
            return _AnalysisFileCount2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 12:
            _context.next = 14;
            return _AnalysisFileCount2.default.insertMany(fileFolderCounts.map(function (f) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(f.tenantId),
                name: "fileCount",
                label: "ファイル数合計",
                count: f.fileCount
              };
            }));

          case 14:
            _context.next = 16;
            return _AnalysisFolderCount2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 16:
            _context.next = 18;
            return _AnalysisFolderCount2.default.insertMany(fileFolderCounts.map(function (f) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(f.tenantId),
                name: "folderCount",
                label: "フォルダ数合計",
                count: f.folderCount
              };
            }));

          case 18:

            // フォルダ毎の使用率
            folderRatesConditions = [{
              $match: {
                is_display: true,
                is_dir: false,
                is_deleted: false
              }
            }, {
              $group: {
                _id: "$dir_id",
                dir_id: { $first: "$dir_id" },
                used: { $sum: "$size" }
              }
            }, {
              $lookup: {
                from: "dirs",
                localField: "dir_id",
                foreignField: "descendant",
                as: "dirs"
              }
            }, { $unwind: "$dirs" }, {
              $lookup: {
                from: "tenants",
                localField: "dirs.ancestor",
                foreignField: "home_dir_id",
                as: "tenants"
              }
            }, {
              $match: { tenants: { $ne: [] } }
            }, {
              $lookup: {
                from: "files",
                localField: "dir_id",
                foreignField: "_id",
                as: "dir"
              }
            }, {
              $project: {
                _id: 0,
                dir_id: 1,
                used: 1,
                dir_name: { $arrayElemAt: ["$dir.name", 0] },
                tenant_id: { $arrayElemAt: ["$tenants._id", 0] }
              }
            }, {
              $sort: { tenant_id: 1, used: -1 }
            }];
            _context.next = 21;
            return _File2.default.aggregate(folderRatesConditions);

          case 21:
            folderRates = _context.sent;


            _logger2.default.info("folderRates summary: " + JSON.stringify(folderRates));

            _context.next = 25;
            return _File2.default.aggregate([].concat(folderRatesConditions, [{
              $group: {
                _id: "$tenant_id",
                tenant_id: { $first: "$tenant_id" },
                usedTotal: { $sum: "$used" }
              }
            }, {
              $project: {
                _id: 0,
                tenant_id: 1,
                usedTotal: 1
              }
            }]));

          case 25:
            folderRatesSum = _context.sent;
            _context.next = 28;
            return _AnalysisUseRateFolder2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 28:
            folderRatesCombined = folderRates.map(function (f) {
              var sum = folderRatesSum.filter(function (sum) {
                return sum.tenant_id.toString() === f.tenant_id.toString();
              });
              f.usedTotal = sum[0].usedTotal;
              return f;
            });


            _logger2.default.info("folderRatesCombined summary: " + JSON.stringify(folderRatesCombined));

            _context.next = 32;
            return _AnalysisUseRateFolder2.default.insertMany(folderRatesCombined.map(function (r) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(r.tenant_id),
                name: "useRateFolder",
                label: "フォルダ毎の使用率",
                dir_name: r.dir_name,
                used: r.used,
                used_total: r.usedTotal,
                rate: (r.used / r.usedTotal * 100).toFixed(2)
              };
            }));

          case 32:

            // ユーザ毎の使用率
            userRatesConditions = [{
              $match: {
                is_display: true,
                is_dir: false,
                is_deleted: false
              }
            }, {
              $lookup: {
                from: "authority_files",
                localField: "_id",
                foreignField: "files",
                as: "authority_files"
              }
            }, { $unwind: "$authority_files" }, {
              $group: {
                _id: "$_id",
                size: { $first: "$size" },
                authority_file: { $first: "$authority_files" }
              }
            }, {
              $lookup: {
                from: "users",
                localField: "authority_file.users",
                foreignField: "_id",
                as: "authority_users"
              }
            }, { $unwind: "$authority_users" }, {
              $group: {
                _id: "$authority_users._id",
                account_name: { $first: "$authority_users.account_name" },
                user_name: { $first: "$authority_users.name" },
                tenant_id: { $first: "$authority_users.tenant_id" },
                size: { $sum: "$size" }
              }
            }];
            _context.next = 35;
            return _File2.default.aggregate(userRatesConditions);

          case 35:
            userRates = _context.sent;


            _logger2.default.info("userRates summary: " + JSON.stringify(userRates));

            userRatesSumConditions = [].concat(userRatesConditions, [{
              $group: {
                _id: "$tenant_id",
                size: { $sum: "$size" }
              }
            }]);
            _context.next = 40;
            return _File2.default.aggregate(userRatesSumConditions);

          case 40:
            userRatesSum = _context.sent;

            _logger2.default.info("userGroupRatesSum summary: " + JSON.stringify(userRatesSum));

            // 2重集計防止
            _context.next = 44;
            return _AnalysisUseRateUser2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 44:
            userRatesRecords = userRates.map(function (user) {
              var tenantSum = userRatesSum.filter(function (sum) {
                return user.tenant_id.toString() === sum._id.toString();
              })[0].size;

              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(user.tenant_id),
                name: "useRateUser",
                label: "ユーザ毎の使用率",
                account_name: user.account_name,
                user_name: user.user_name,
                used: user.size,
                used_total: tenantSum,
                rate: (user.size / tenantSum * 100).toFixed(2)
              };
            });


            _logger2.default.info("userRates + sum summary: " + JSON.stringify(userRatesSum));
            _context.next = 48;
            return _AnalysisUseRateUser2.default.insertMany(userRatesRecords);

          case 48:

            // タグ毎の使用率 ここから
            tagRatesConditions = [{
              $match: {
                is_display: true,
                is_dir: false,
                is_deleted: false
              }
            }, {
              $project: {
                dir_id: 1,
                size: 1,
                name: 1,
                tags: 1
              }
            }, {
              $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
              }
            }, {
              // 「タグなし」も集計に含めるので
              $unwind: {
                path: "$tags",
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: "dirs",
                localField: "dir_id",
                foreignField: "descendant",
                as: "dirs"
              }
            }, { $unwind: "$dirs" }, {
              $lookup: {
                from: "tenants",
                localField: "dirs.ancestor",
                foreignField: "home_dir_id",
                as: "tenants"
              }
            }, {
              $match: { tenants: { $ne: [] } }
            }, {
              $project: {
                used: "$size",
                tenant_id: { $arrayElemAt: ["$tenants._id", 0] },
                tag_id: "$tags._id",
                tag_label: "$tags.label"
              }
            }, {
              $group: {
                _id: { tenant_id: "$tenant_id", tag_id: "$tag_id" },
                tenant_id: { $first: "$tenant_id" },
                used: { $sum: "$used" },
                count: { $sum: 1 },
                tag_id: { $first: "$tag_id" },
                tag_label: { $first: "$tag_label" }
              }
            }];
            _context.next = 51;
            return _File2.default.aggregate(tagRatesConditions);

          case 51:
            tagRates = _context.sent;
            _context.next = 54;
            return _File2.default.aggregate([].concat(tagRatesConditions, [{
              $group: {
                _id: "$tenant_id",
                tenant_id: { $first: "$tenant_id" },
                used_total: { $sum: "$used" },
                count: { $sum: "$count" }
              }
            }]));

          case 54:
            tagRatesGroupByTenants = _context.sent;


            _logger2.default.info("tagRates summary: " + JSON.stringify(tagRates));
            _logger2.default.info("tagRatesGroupByTenants summary: " + JSON.stringify(tagRatesGroupByTenants));

            _context.next = 59;
            return _AnalysisUseRateTag2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 59:
            tagRatesCombined = tagRates.map(function (t) {
              var sum = tagRatesGroupByTenants.filter(function (sum) {
                return sum.tenant_id.toString() === t.tenant_id.toString();
              });
              t.used_total = sum[0].used_total;
              return t;
            });


            _logger2.default.info("tagRatesCombined summary: " + JSON.stringify(tagRatesCombined));

            _context.next = 63;
            return _AnalysisUseRateTag2.default.insertMany(tagRatesCombined.map(function (t) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(t.tenant_id),
                name: "useRateTag",
                label: "タグ毎の使用率",
                tag_id: _mongoose.Types.ObjectId(t.tag_id),
                tag_label: t.tag_label,
                used: t.used,
                count: t.count,
                used_total: t.used_total,
                rate: (t.used / t.used_total * 100).toFixed(2)
              };
            }));

          case 63:

            // mime毎の使用率 ここから
            mimeRatesConditions = [{
              $match: {
                is_display: true,
                is_dir: false,
                is_deleted: false
              }
            }, {
              $project: {
                size: 1,
                dir_id: 1,
                mime_type: 1
              }
            }, {
              $lookup: {
                from: "dirs",
                localField: "dir_id",
                foreignField: "descendant",
                as: "dirs"
              }
            }, { $unwind: "$dirs" }, {
              $lookup: {
                from: "tenants",
                localField: "dirs.ancestor",
                foreignField: "home_dir_id",
                as: "tenants"
              }
            }, {
              $match: { tenants: { $ne: [] } }
            }, {
              $project: {
                _id: 0,
                used: "$size",
                tenant_id: { $arrayElemAt: ["$tenants._id", 0] },
                mime_type: "$mime_type"
              }
            }, {
              $group: {
                _id: { tenant_id: "$tenant_id", mime_type: "$mime_type" },
                tenant_id: { $first: "$tenant_id" },
                used: { $sum: "$used" },
                count: { $sum: 1 },
                mime_type: { $first: "$mime_type" }
              }
            }];
            _context.next = 66;
            return _File2.default.aggregate(mimeRatesConditions);

          case 66:
            mimeRates = _context.sent;
            _context.next = 69;
            return _File2.default.aggregate([].concat(mimeRatesConditions, [{
              $group: {
                _id: "$tenant_id",
                tenant_id: { $first: "$tenant_id" },
                used_total: { $sum: "$used" },
                count_total: { $sum: "$count" }
              }
            }]));

          case 69:
            mimeRatesGroupByTenants = _context.sent;


            _logger2.default.info("mimeRates summary: " + JSON.stringify(mimeRates));
            _logger2.default.info("mimeRatesGroupByTenants summary: " + JSON.stringify(tagRatesGroupByTenants));

            mimeRatesCombined = mimeRates.map(function (m) {
              var sum = mimeRatesGroupByTenants.filter(function (sum) {
                return sum.tenant_id.toString() === m.tenant_id.toString();
              });
              m.used_total = sum[0].used_total;
              m.count_total = sum[0].count_total;
              return m;
            });


            _logger2.default.info("mimeRatesCombined summary: " + JSON.stringify(mimeRatesCombined));

            _context.next = 76;
            return _AnalysisUseRateMimeType2.default.remove({
              reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10)
            });

          case 76:
            _context.next = 78;
            return _AnalysisUseRateMimeType2.default.insertMany(mimeRatesCombined.map(function (m) {
              return {
                reported_at: parseInt((0, _moment2.default)().utc().add(9, "hours").format("YYYYMMDD"), 10),
                tenant_id: _mongoose.Types.ObjectId(m.tenant_id),
                name: "useRateMimeType",
                label: "mime-type毎の使用率",
                mime_type: m.mime_type,
                used: m.used,
                used_total: m.used_total,
                count: m.count,
                count_total: m.count_total,
                rate: (m.used / m.used_total * 100).toFixed(2)
              };
            }));

          case 78:

            _logger2.default.info("################# analyze end #################");
            _context.next = 86;
            break;

          case 81:
            _context.prev = 81;
            _context.t0 = _context["catch"](0);

            console.log(_util2.default.inspect(_context.t0, false, null));
            _logger2.default.error(_context.t0);
            process.exit();

          case 86:
            _context.prev = 86;

            _logger2.default.info("################# analyze end #################");
            process.exit();
            return _context.finish(86);

          case 90:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 81, 86, 90]]);
  }));
};

// models
exports.default = task;