"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._aggregateMetaInfo = exports.disableAutoGrantToken = exports.enableAutoGrantToken = exports.downloadToken = exports.verifyToken = exports.grantTimestampToken = exports.grantToken = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _File = _interopRequireDefault(require("../models/File"));

var _FileMetaInfo = _interopRequireDefault(require("../models/FileMetaInfo"));

var _MetaInfo = _interopRequireDefault(require("../models/MetaInfo"));

var _Dir = _interopRequireDefault(require("../models/Dir"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _elasticsearchclient = _interopRequireDefault(require("../elasticsearchclient"));

var _logger = _interopRequireDefault(require("../logger"));

var _tsaClient = _interopRequireDefault(require("../apis/tsaClient"));

var _Swift = require("../storages/Swift");

var _fs = _interopRequireDefault(require("fs"));

var _util = _interopRequireDefault(require("util"));

var _AppError = require("../errors/AppError");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var grantToken =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var file_id, meta_info, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === null || file_id === undefined || file_id === "")) {
              _context.next = 4;
              break;
            }

            throw new _AppError.ValidationError("file_id is empty");

          case 4:
            if (_mongoose["default"].Types.ObjectId.isValid(file_id)) {
              _context.next = 6;
              break;
            }

            throw new _AppError.ValidationError("file_id is invalid");

          case 6:
            _context.next = 8;
            return grantTimestampToken(file_id, res.user.tenant._id);

          case 8:
            meta_info = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: {
                meta_info: meta_info
              }
            });
            _context.next = 31;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            _logger["default"].error(_context.t0);

            errors = {};
            _context.t1 = _context.t0.message;
            _context.next = _context.t1 === "file_id is empty" ? 19 : _context.t1 === "file_id is invalid" ? 21 : _context.t1 === "file is empty" ? 23 : _context.t1 === "file is deleted" ? 23 : _context.t1 === "File is a kind of directory" ? 25 : _context.t1 === "TSA authentication info is not found" ? 27 : 29;
            break;

          case 19:
            errors.file_id = "ファイルIDが空です";
            return _context.abrupt("break", 30);

          case 21:
            errors.file_id = "ファイルIDが不正です";
            return _context.abrupt("break", 30);

          case 23:
            errors.file_id = "指定されたファイルが存在ません";
            return _context.abrupt("break", 30);

          case 25:
            errors.file_id = "対象がフォルダです";
            return _context.abrupt("break", 30);

          case 27:
            errors.tsa_auth = "TSA認証情報が見つかりません";
            return _context.abrupt("break", 30);

          case 29:
            errors.unknown = _context.t0.message;

          case 30:
            res.status(400).json({
              status: {
                success: false,
                message: "タイムスタンプの発行に失敗しました",
                errors: errors
              }
            });

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12]]);
  }));

  return function grantToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.grantToken = grantToken;

var grantTimestampToken =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(file_id, tenant_id) {
    var tsMetaInfo, tenant, file, readStream, encodedFile, metaInfo, fileMetaInfo, grantData, tsaApi, _ref3, ts_flg, verifresult, _ref4, _ref5, verifyData, _ref6, _ref7, updatedFile, update_info, itemsize;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _Tenant["default"].findById(tenant_id);

          case 3:
            tenant = _context2.sent;

            if (tenant) {
              _context2.next = 6;
              break;
            }

            throw "Tenant ".concat(tenant_id, " is not found");

          case 6:
            if (!(!tenant.tsaAuth || !tenant.tsaAuth.user || !tenant.tsaAuth.pass)) {
              _context2.next = 8;
              break;
            }

            throw new _AppError.ValidationError("TSA authentication info is not found");

          case 8:
            _context2.next = 10;
            return _File["default"].findById(file_id);

          case 10:
            file = _context2.sent;

            if (file) {
              _context2.next = 13;
              break;
            }

            throw new _AppError.ValidationError("file is empty");

          case 13:
            if (!file.is_deleted) {
              _context2.next = 15;
              break;
            }

            throw new _AppError.ValidationError("file is deleted");

          case 15:
            if (!file.is_dir) {
              _context2.next = 17;
              break;
            }

            throw new _AppError.ValidationError("File is a kind of directory");

          case 17:
            _context2.next = 19;
            return new _Swift.Swift().downloadFile(tenant.name, file);

          case 19:
            readStream = _context2.sent;
            _context2.next = 22;
            return new Promise(function (resolve, reject) {
              var chunks = [];
              readStream.on("data", function (chunk) {
                return chunks.push(chunk);
              }).on("end", function () {
                return resolve(Buffer.concat(chunks).toString("base64"));
              }).on("error", function (e) {
                return reject(e);
              });
            });

          case 22:
            encodedFile = _context2.sent;
            _context2.next = 25;
            return _MetaInfo["default"].findOne({
              name: "timestamp"
            });

          case 25:
            metaInfo = _context2.sent;
            _context2.next = 28;
            return _FileMetaInfo["default"].findOne({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });

          case 28:
            fileMetaInfo = _context2.sent;

            if (!fileMetaInfo) {
              fileMetaInfo = new _FileMetaInfo["default"]({
                file_id: file._id,
                meta_info_id: metaInfo._id,
                value: []
              });
            }

            tsaApi = new _tsaClient["default"](tenant.tsaAuth.user, tenant.tsaAuth.pass);

            if (!(file.mime_type !== "application/pdf")) {
              _context2.next = 38;
              break;
            }

            _context2.next = 34;
            return tsaApi.grantToken(file._id.toString(), encodedFile);

          case 34:
            _ref3 = _context2.sent;
            grantData = _ref3.data;
            _context2.next = 62;
            break;

          case 38:
            ts_flg = false;
            verifresult = null;
            _context2.prev = 40;
            _context2.next = 43;
            return tsaApi.verifyPades(file._id.toString(), encodedFile);

          case 43:
            verifresult = _context2.sent;

            if (verifresult.data.result.status === "Success") {
              ts_flg = true;
            }

            _context2.next = 49;
            break;

          case 47:
            _context2.prev = 47;
            _context2.t0 = _context2["catch"](40);

          case 49:
            _context2.prev = 49;
            return _context2.finish(49);

          case 51:
            if (!ts_flg) {
              _context2.next = 58;
              break;
            }

            _context2.next = 54;
            return tsaApi.grantaddLTV(file._id.toString(), encodedFile);

          case 54:
            _ref4 = _context2.sent;
            grantData = _ref4.data;
            _context2.next = 62;
            break;

          case 58:
            _context2.next = 60;
            return tsaApi.grantEst(file._id.toString(), encodedFile);

          case 60:
            _ref5 = _context2.sent;
            grantData = _ref5.data;

          case 62:
            if (!grantData.timestampToken) {
              _context2.next = 85;
              break;
            }

            if (!(file.mime_type !== "application/pdf")) {
              _context2.next = 70;
              break;
            }

            _context2.next = 66;
            return tsaApi.verifyToken(file._id.toString(), encodedFile, grantData.timestampToken.token);

          case 66:
            _ref6 = _context2.sent;
            verifyData = _ref6.data;
            _context2.next = 74;
            break;

          case 70:
            _context2.next = 72;
            return tsaApi.verifyPades(file._id.toString(), grantData.file);

          case 72:
            _ref7 = _context2.sent;
            verifyData = _ref7.data;

          case 74:
            fileMetaInfo.value = [].concat((0, _toConsumableArray2["default"])(fileMetaInfo.value), [_objectSpread({}, grantData.timestampToken, {}, verifyData.result)]);
            _context2.next = 77;
            return fileMetaInfo.save();

          case 77:
            _context2.next = 79;
            return _File["default"].searchFileOne({
              _id: file._id
            });

          case 79:
            updatedFile = _context2.sent;
            tsMetaInfo = updatedFile.meta_infos.find(function (m) {
              return m.name === metaInfo.name;
            });

            if (tsMetaInfo) {
              _context2.next = 83;
              break;
            }

            throw "Failed to create timestamp meta info.";

          case 83:
            _context2.next = 85;
            return _elasticsearchclient["default"].createIndex(tenant_id, [updatedFile]);

          case 85:
            if (!(file.mime_type === "application/pdf")) {
              _context2.next = 103;
              break;
            }

            _context2.prev = 86;
            _context2.next = 89;
            return new _Swift.Swift().upload(tenant.name, Buffer.from(grantData.file, 'base64'), file._id.toString());

          case 89:
            _context2.next = 91;
            return _File["default"].findById(file._id);

          case 91:
            update_info = _context2.sent;
            itemsize = Buffer.from(grantData.file, 'base64').length;
            update_info.modified = Date.now();
            update_info.size = itemsize;
            _context2.next = 97;
            return update_info.save();

          case 97:
            _context2.next = 103;
            break;

          case 99:
            _context2.prev = 99;
            _context2.t1 = _context2["catch"](86);

            _logger["default"].error(_context2.t1);

            throw "ファイル本体の保存に失敗しました";

          case 103:
            return _context2.abrupt("return", tsMetaInfo);

          case 106:
            _context2.prev = 106;
            _context2.t2 = _context2["catch"](0);
            throw _context2.t2;

          case 109:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 106], [40, 47, 49, 51], [86, 99]]);
  }));

  return function grantTimestampToken(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.grantTimestampToken = grantTimestampToken;

var verifyToken =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var file_id, file, tsaAuth, metaInfo, fileMetaInfo, tenant_name, readStream, encodedFile, tsaApi, inspectresult, timestamp, verifyData, _ref9, _ref10, updatedFile, tsMetaInfo, errors;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            file_id = req.params.file_id;

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
            file = _context3.sent;

            if (!(file === null)) {
              _context3.next = 11;
              break;
            }

            throw new _AppError.ValidationError("file is empty");

          case 11:
            if (!file.is_deleted) {
              _context3.next = 13;
              break;
            }

            throw new _AppError.ValidationError("file is deleted");

          case 13:
            if (!file.is_dir) {
              _context3.next = 15;
              break;
            }

            throw new _AppError.ValidationError("File is a kind of directory");

          case 15:
            tsaAuth = res.user.tenant.tsaAuth;

            if (!(!tsaAuth || !tsaAuth.user || !tsaAuth.pass)) {
              _context3.next = 18;
              break;
            }

            throw new _AppError.ValidationError("TSA authentication info is not found");

          case 18:
            _context3.next = 20;
            return _MetaInfo["default"].findOne({
              name: "timestamp"
            });

          case 20:
            metaInfo = _context3.sent;
            _context3.next = 23;
            return _FileMetaInfo["default"].findOne({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });

          case 23:
            fileMetaInfo = _context3.sent;
            tenant_name = res.user.tenant.name;
            _context3.next = 27;
            return new _Swift.Swift().downloadFile(tenant_name, file);

          case 27:
            readStream = _context3.sent;
            _context3.next = 30;
            return new Promise(function (resolve, reject) {
              var chunks = [];
              readStream.on("data", function (chunk) {
                return chunks.push(chunk);
              }).on("end", function () {
                return resolve(Buffer.concat(chunks).toString("base64"));
              }).on("error", function (e) {
                return reject(e);
              });
            });

          case 30:
            encodedFile = _context3.sent;
            tsaApi = new _tsaClient["default"](tsaAuth.user, tsaAuth.pass);

            if (!(!fileMetaInfo || fileMetaInfo.value.length === 0)) {
              _context3.next = 41;
              break;
            }

            _context3.next = 35;
            return tsaApi.inspect(file._id.toString(), encodedFile);

          case 35:
            inspectresult = _context3.sent.data;

            if (inspectresult.hasToken) {
              _context3.next = 38;
              break;
            }

            throw new _AppError.ValidationError("The file does not have timestamp token");

          case 38:
            timestamp = inspectresult.timestampToken;
            _context3.next = 42;
            break;

          case 41:
            timestamp = fileMetaInfo.value[fileMetaInfo.value.length - 1];

          case 42:
            if (!(file.mime_type !== "application/pdf")) {
              _context3.next = 49;
              break;
            }

            _context3.next = 45;
            return tsaApi.verifyToken(file._id.toString(), encodedFile, timestamp.token);

          case 45:
            _ref9 = _context3.sent;
            verifyData = _ref9.data;
            _context3.next = 53;
            break;

          case 49:
            _context3.next = 51;
            return tsaApi.verifyPades(file._id.toString(), encodedFile);

          case 51:
            _ref10 = _context3.sent;
            verifyData = _ref10.data;

          case 53:
            if (!(!fileMetaInfo || fileMetaInfo.value.length === 0)) {
              _context3.next = 60;
              break;
            }

            fileMetaInfo = new _FileMetaInfo["default"]({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });
            fileMetaInfo.value = [_objectSpread({}, timestamp, {}, verifyData.result)];
            _context3.next = 58;
            return fileMetaInfo.save();

          case 58:
            _context3.next = 62;
            break;

          case 60:
            _context3.next = 62;
            return fileMetaInfo.update({
              $set: (0, _defineProperty2["default"])({}, "value.".concat(fileMetaInfo.value.length - 1), _objectSpread({}, timestamp, {}, verifyData.result))
            });

          case 62:
            _context3.next = 64;
            return _File["default"].searchFileOne({
              _id: file._id
            });

          case 64:
            updatedFile = _context3.sent;
            tsMetaInfo = updatedFile.meta_infos.find(function (m) {
              return m.name === metaInfo.name;
            });

            if (tsMetaInfo) {
              _context3.next = 68;
              break;
            }

            throw new _AppError.ValidationError("Failed to create timestamp meta info.");

          case 68:
            _context3.next = 70;
            return _elasticsearchclient["default"].createIndex(res.user.tenant._id, [updatedFile]);

          case 70:
            res.json({
              status: {
                success: true
              },
              body: {
                meta_info: tsMetaInfo
              }
            });
            _context3.next = 102;
            break;

          case 73:
            _context3.prev = 73;
            _context3.t0 = _context3["catch"](0);

            _logger["default"].error(_context3.t0);

            errors = {};
            _context3.t1 = _context3.t0.message;
            _context3.next = _context3.t1 === "file_id is empty" ? 80 : _context3.t1 === "file_id is invalid" ? 82 : _context3.t1 === "file is empty" ? 84 : _context3.t1 === "file is deleted" ? 84 : _context3.t1 === "File is a kind of directory" ? 86 : _context3.t1 === "TSA authentication info is not found" ? 88 : _context3.t1 === "The file does not have timestamp token" ? 90 : _context3.t1 === "Failed to create timestamp meta info." ? 92 : 94;
            break;

          case 80:
            errors.file_id = "ファイルIDが空です";
            return _context3.abrupt("break", 95);

          case 82:
            errors.file_id = "ファイルIDが不正です";
            return _context3.abrupt("break", 95);

          case 84:
            errors.file_id = "指定されたファイルが存在しません";
            return _context3.abrupt("break", 95);

          case 86:
            errors.file_id = "対象がフォルダです";
            return _context3.abrupt("break", 95);

          case 88:
            errors.tsa_auth = "TSA認証情報が見つかりません";
            return _context3.abrupt("break", 95);

          case 90:
            errors.file_id = "ファイルにタイムスタンプが付与されていません";
            return _context3.abrupt("break", 95);

          case 92:
            errors.verify = "タイムスタンプ検証情報の生成に失敗しました";
            return _context3.abrupt("break", 95);

          case 94:
            errors.unknown = _context3.t0;

          case 95:
            _context3.t2 = _context3.t0;
            _context3.next = _context3.t2 === "file_id is empty" ? 98 : 100;
            break;

          case 98:
            errors.file_id = _context3.t0;
            return _context3.abrupt("break", 101);

          case 100:
            return _context3.abrupt("break", 101);

          case 101:
            res.status(400).json({
              status: {
                success: false,
                message: "タイムスタンプの検証に失敗しました",
                errors: errors
              }
            });

          case 102:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 73]]);
  }));

  return function verifyToken(_x6, _x7, _x8) {
    return _ref8.apply(this, arguments);
  };
}();

exports.verifyToken = verifyToken;

var downloadToken =
/*#__PURE__*/
function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res, next) {
    var file_id, file, metaInfo, fileMetaInfo, timestamp, contents, tmpFilePath, errors;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            file_id = req.query.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context4.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            _context4.next = 6;
            return _File["default"].findById(file_id);

          case 6:
            file = _context4.sent;

            if (!file.is_dir) {
              _context4.next = 9;
              break;
            }

            throw "it's not a file";

          case 9:
            _context4.next = 11;
            return _MetaInfo["default"].findOne({
              name: "timestamp"
            });

          case 11:
            metaInfo = _context4.sent;
            _context4.next = 14;
            return _FileMetaInfo["default"].findOne({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });

          case 14:
            fileMetaInfo = _context4.sent;

            if (fileMetaInfo) {
              _context4.next = 17;
              break;
            }

            throw new Error("File meta info for timestamp is not found");

          case 17:
            timestamp = fileMetaInfo.value[fileMetaInfo.value.length - 1];
            contents = Buffer.from(timestamp.token, "base64");
            tmpFilePath = '/tmp/ts_token_of_' + file_id + require('crypto').randomBytes(8).toString('hex');

            _fs["default"].writeFile(tmpFilePath, contents, function () {
              var readStream = _fs["default"].createReadStream(tmpFilePath);

              readStream.on("data", function (data) {
                return res.write(data);
              });
              readStream.on("end", function () {
                res.end();

                try {
                  _fs["default"].unlinkSync(tmpFilePath);
                } catch (e) {
                  _logger["default"].error(e);
                }
              });
            });

            _context4.next = 34;
            break;

          case 23:
            _context4.prev = 23;
            _context4.t0 = _context4["catch"](0);

            _logger["default"].error(_context4.t0);

            errors = {};
            _context4.t1 = _context4.t0;
            _context4.next = _context4.t1 === "file_id is empty" ? 30 : 32;
            break;

          case 30:
            errors.file_id = _context4.t0;
            return _context4.abrupt("break", 33);

          case 32:
            return _context4.abrupt("break", 33);

          case 33:
            res.status(400).json({
              status: {
                success: false,
                message: "タイムスタンプトークンのダウンロードに失敗しました",
                errors: errors
              }
            });

          case 34:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 23]]);
  }));

  return function downloadToken(_x9, _x10, _x11) {
    return _ref11.apply(this, arguments);
  };
}();

exports.downloadToken = downloadToken;

var enableAutoGrantToken =
/*#__PURE__*/
function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res, next) {
    var file_id, file, metaInfo, fileMetaInfo, dirs, updatedFile, autoGrantTsInfo, errors;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context6.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            _context6.next = 6;
            return _File["default"].findById(file_id);

          case 6:
            file = _context6.sent;

            if (file.is_dir) {
              _context6.next = 9;
              break;
            }

            throw "it's not a directory";

          case 9:
            _context6.next = 11;
            return _MetaInfo["default"].findOne({
              name: "auto_grant_timestamp"
            });

          case 11:
            metaInfo = _context6.sent;
            _context6.next = 14;
            return _FileMetaInfo["default"].findOne({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });

          case 14:
            fileMetaInfo = _context6.sent;

            if (!fileMetaInfo) {
              fileMetaInfo = new _FileMetaInfo["default"]({
                file_id: file._id,
                meta_info_id: metaInfo._id
              });
            }

            fileMetaInfo.value = true;
            _context6.next = 19;
            return fileMetaInfo.save();

          case 19:
            _context6.next = 21;
            return findAllDescendants(file._id);

          case 21:
            dirs = _context6.sent;
            _context6.next = 24;
            return Promise.all(dirs.map(
            /*#__PURE__*/
            function () {
              var _ref13 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee5(dir) {
                var fileMetaInfo;
                return _regenerator["default"].wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return _FileMetaInfo["default"].findOne({
                          file_id: dir.file._id,
                          meta_info_id: metaInfo._id
                        });

                      case 2:
                        fileMetaInfo = _context5.sent;

                        if (!fileMetaInfo) {
                          fileMetaInfo = new _FileMetaInfo["default"]({
                            file_id: dir.file._id,
                            meta_info_id: metaInfo._id
                          });
                        }

                        fileMetaInfo.value = true;
                        _context5.next = 7;
                        return fileMetaInfo.save();

                      case 7:
                        return _context5.abrupt("return", _context5.sent);

                      case 8:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5);
              }));

              return function (_x15) {
                return _ref13.apply(this, arguments);
              };
            }()));

          case 24:
            _context6.next = 26;
            return _File["default"].searchFileOne({
              _id: file._id
            });

          case 26:
            updatedFile = _context6.sent;
            autoGrantTsInfo = updatedFile.meta_infos.find(function (m) {
              return m.name === metaInfo.name;
            });
            res.json({
              status: {
                success: true
              },
              body: {
                meta_info: autoGrantTsInfo
              }
            });
            _context6.next = 43;
            break;

          case 31:
            _context6.prev = 31;
            _context6.t0 = _context6["catch"](0);

            _logger["default"].error(_context6.t0);

            errors = {};
            _context6.t1 = _context6.t0;
            _context6.next = _context6.t1 === "file_id is empty" ? 38 : 40;
            break;

          case 38:
            errors.file_id = _context6.t0;
            return _context6.abrupt("break", 42);

          case 40:
            errors.unknown = _context6.t0;
            return _context6.abrupt("break", 42);

          case 42:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 43:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 31]]);
  }));

  return function enableAutoGrantToken(_x12, _x13, _x14) {
    return _ref12.apply(this, arguments);
  };
}();

exports.enableAutoGrantToken = enableAutoGrantToken;

var disableAutoGrantToken =
/*#__PURE__*/
function () {
  var _ref14 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(req, res, next) {
    var file_id, file, metaInfo, fileMetaInfo, dirs, updatedFile, autoGrantTsInfo, errors;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            file_id = req.params.file_id;

            if (!(file_id === undefined || file_id === null || file_id === "")) {
              _context8.next = 4;
              break;
            }

            throw "file_id is empty";

          case 4:
            _context8.next = 6;
            return _File["default"].findById(file_id);

          case 6:
            file = _context8.sent;

            if (file.is_dir) {
              _context8.next = 9;
              break;
            }

            throw "it's not a directory";

          case 9:
            _context8.next = 11;
            return _MetaInfo["default"].findOne({
              name: "auto_grant_timestamp"
            });

          case 11:
            metaInfo = _context8.sent;
            _context8.next = 14;
            return _FileMetaInfo["default"].findOne({
              file_id: file._id,
              meta_info_id: metaInfo._id
            });

          case 14:
            fileMetaInfo = _context8.sent;

            if (!fileMetaInfo) {
              fileMetaInfo = new _FileMetaInfo["default"]({
                file_id: file._id,
                meta_info_id: metaInfo._id
              });
            }

            fileMetaInfo.value = false;
            _context8.next = 19;
            return fileMetaInfo.save();

          case 19:
            _context8.next = 21;
            return findAllDescendants(file._id);

          case 21:
            dirs = _context8.sent;
            _context8.next = 24;
            return Promise.all(dirs.map(
            /*#__PURE__*/
            function () {
              var _ref15 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee7(dir) {
                var fileMetaInfo;
                return _regenerator["default"].wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return _FileMetaInfo["default"].findOne({
                          file_id: dir.file._id,
                          meta_info_id: metaInfo._id
                        });

                      case 2:
                        fileMetaInfo = _context7.sent;

                        if (!fileMetaInfo) {
                          fileMetaInfo = new _FileMetaInfo["default"]({
                            file_id: dir.file._id,
                            meta_info_id: metaInfo._id
                          });
                        }

                        fileMetaInfo.value = false;
                        _context7.next = 7;
                        return fileMetaInfo.save();

                      case 7:
                        return _context7.abrupt("return", _context7.sent);

                      case 8:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7);
              }));

              return function (_x19) {
                return _ref15.apply(this, arguments);
              };
            }()));

          case 24:
            _context8.next = 26;
            return _File["default"].searchFileOne({
              _id: file._id
            });

          case 26:
            updatedFile = _context8.sent;
            autoGrantTsInfo = updatedFile.meta_infos.find(function (m) {
              return m.name === metaInfo.name;
            });
            res.json({
              status: {
                success: true
              },
              body: {
                meta_info: autoGrantTsInfo
              }
            });
            _context8.next = 43;
            break;

          case 31:
            _context8.prev = 31;
            _context8.t0 = _context8["catch"](0);

            _logger["default"].error(_context8.t0);

            errors = {};
            _context8.t1 = _context8.t0;
            _context8.next = _context8.t1 === "file_id is empty" ? 38 : 40;
            break;

          case 38:
            errors.file_id = _context8.t0;
            return _context8.abrupt("break", 42);

          case 40:
            errors.unknown = _context8.t0;
            return _context8.abrupt("break", 42);

          case 42:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 43:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 31]]);
  }));

  return function disableAutoGrantToken(_x16, _x17, _x18) {
    return _ref14.apply(this, arguments);
  };
}();

exports.disableAutoGrantToken = disableAutoGrantToken;

var _aggregateMetaInfo =
/*#__PURE__*/
function () {
  var _ref16 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(file_id, meta_info_name) {
    var _$project;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _FileMetaInfo["default"].aggregate([{
              $match: {
                file_id: file_id
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
                "meta_info.name": meta_info_name
              }
            }, {
              $project: (_$project = {
                id: "$meta_info._id",
                label: "$meta_info.label",
                name: "$meta_info.name",
                meta_info_id: "$meta_info_id"
              }, (0, _defineProperty2["default"])(_$project, "label", "$meta_info.label"), (0, _defineProperty2["default"])(_$project, "sort_target", null), (0, _defineProperty2["default"])(_$project, "value", "$value"), (0, _defineProperty2["default"])(_$project, "value_type", "$meta_info.value_type"), _$project)
            }]).then(function (items) {
              return items[0];
            });

          case 2:
            return _context9.abrupt("return", _context9.sent);

          case 3:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function _aggregateMetaInfo(_x20, _x21) {
    return _ref16.apply(this, arguments);
  };
}();

exports._aggregateMetaInfo = _aggregateMetaInfo;

var findAllDescendants =
/*#__PURE__*/
function () {
  var _ref17 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(file_id) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _Dir["default"].aggregate([{
              $match: {
                ancestor: file_id,
                depth: {
                  $gt: 0
                }
              }
            }, {
              $lookup: {
                from: "files",
                localField: "descendant",
                foreignField: "_id",
                as: "file"
              }
            }, {
              $unwind: {
                path: "$file",
                preserveNullAndEmptyArrays: true
              }
            }]);

          case 2:
            return _context10.abrupt("return", _context10.sent);

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function findAllDescendants(_x22) {
    return _ref17.apply(this, arguments);
  };
}();