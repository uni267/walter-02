"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.add = exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _co = _interopRequireDefault(require("co"));

var _mongoose = require("mongoose");

var _DownloadInfo = _interopRequireDefault(require("../models/DownloadInfo"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var index = function index(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var downloadinfo_type, tenant_id, downloadinfo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            downloadinfo_type = req.params.downloadinfo_type;
            tenant_id = res.user.tenant_id;

            if (!(downloadinfo_type === undefined || downloadinfo_type === null || downloadinfo_type === "")) {
              _context.next = 5;
              break;
            }

            throw "type is empty";

          case 5:
            _context.next = 7;
            return _DownloadInfo["default"].findOne({
              tenant_id: tenant_id,
              type: downloadinfo_type
            });

          case 7:
            downloadinfo = _context.sent;

            if (!(downloadinfo === undefined || downloadinfo === null || downloadinfo === "")) {
              _context.next = 10;
              break;
            }

            throw "downloadinfo is undefined";

          case 10:
            res.json({
              status: {
                success: true
              },
              body: {
                downloadinfo: downloadinfo,
                extensionTarget: downloadinfo.extensionTarget
              }
            });
            _context.next = 16;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            res.status(400).json();

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));
};

exports.index = index;

var add = function add(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var downloadinfo, tenant_id, _downloadinfo, new_downloadinfo, saved_downloadinfo, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            downloadinfo = req.body.downloadinfo;
            tenant_id = res.user.tenant_id;

            if (!(downloadinfo.value === undefined || downloadinfo.value === null || downloadinfo.value === "")) {
              _context2.next = 5;
              break;
            }

            throw "value is empty";

          case 5:
            if (!(downloadinfo.type === undefined || downloadinfo.type === null || downloadinfo.type === "")) {
              _context2.next = 7;
              break;
            }

            throw "type is empty";

          case 7:
            _context2.next = 9;
            return _DownloadInfo["default"].find({
              tenant_id: _mongoose.Types.ObjectId(tenant_id),
              type: downloadinfo.type
            }).count();

          case 9:
            _downloadinfo = _context2.sent;

            if (!(_downloadinfo > 0)) {
              _context2.next = 12;
              break;
            }

            throw "downloadinfo is already exists";

          case 12:
            new_downloadinfo = new _DownloadInfo["default"]();
            new_downloadinfo.tenant_id = tenant_id;
            new_downloadinfo.type = downloadinfo.type;
            new_downloadinfo.value = downloadinfo.value;
            _context2.next = 18;
            return new_downloadinfo.save();

          case 18:
            saved_downloadinfo = _context2.sent;
            res.json({
              status: {
                success: true
              },
              body: saved_downloadinfo
            });
            _context2.next = 32;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0;
            _context2.next = _context2.t1 === "" ? 28 : 29;
            break;

          case 28:
            return _context2.abrupt("break", 31);

          case 29:
            errors.unknown = _context2.t0;
            return _context2.abrupt("break", 31);

          case 31:
            res.status(400).json({
              status: {
                success: false,
                message: "ダウンロード情報の登録に失敗しました",
                errors: errors
              }
            });

          case 32:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 22]]);
  }));
}; // ひとまずはvalueのみ


exports.add = add;

var update = function update(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    var downloadinfo, downloadinfo_id, tenant_id, _downloadinfo, changed_downloadinfo, errors;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            downloadinfo = req.body.downloadinfo;
            downloadinfo_id = req.params.downloadinfo_id;
            tenant_id = res.user.tenant_id;

            if (!(downloadinfo.value === undefined || downloadinfo.value === null || downloadinfo.value === "")) {
              _context3.next = 6;
              break;
            }

            throw "value is empty";

          case 6:
            _context3.next = 8;
            return _DownloadInfo["default"].findOne({
              tenant_id: _mongoose.Types.ObjectId(tenant_id),
              _id: _mongoose.Types.ObjectId(downloadinfo_id)
            });

          case 8:
            _downloadinfo = _context3.sent;

            if (!(_downloadinfo === undefined || _downloadinfo === null || _downloadinfo === "")) {
              _context3.next = 11;
              break;
            }

            throw "downloadinfo is undefined";

          case 11:
            _downloadinfo.value = downloadinfo.value;
            _context3.next = 14;
            return _downloadinfo.save();

          case 14:
            changed_downloadinfo = _context3.sent;
            res.json({
              status: {
                success: true
              },
              body: changed_downloadinfo,
              test: "update"
            });
            _context3.next = 28;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](0);
            errors = {};
            _context3.t1 = _context3.t0;
            _context3.next = _context3.t1 === "" ? 24 : 25;
            break;

          case 24:
            return _context3.abrupt("break", 27);

          case 25:
            errors.unknown = _context3.t0;
            return _context3.abrupt("break", 27);

          case 27:
            res.status(400).json({
              status: {
                success: false,
                message: "ダウンロード情報の登録に失敗しました",
                errors: errors
              }
            });

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 18]]);
  }));
};

exports.update = update;