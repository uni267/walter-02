"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.authentication = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _commons = require("./commons");

var commons = _interopRequireWildcard(_commons);

var _server = require("../configs/server");

var _User = require("../models/User");

var _User2 = _interopRequireDefault(_User);

var _Tenant = require("../models/Tenant");

var _Tenant2 = _interopRequireDefault(_Tenant);

var _AppSetting = require("../models/AppSetting");

var _AppSetting2 = _interopRequireDefault(_AppSetting);

var _files = require("./files");

var _constants = require("../configs/constants");

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authentication = exports.authentication = function authentication(req, res, next) {
  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _req$body, account_name, password, tenant_name, tenant, user, hash, _tenant, _user, _SECURITY_CONF$develo, secretKey, expiresIn, token, errors;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, account_name = _req$body.account_name, password = _req$body.password, tenant_name = _req$body.tenant_name;

            if (!(account_name === undefined || account_name === null || account_name === "")) {
              _context.next = 4;
              break;
            }

            throw "account_name is empty";

          case 4:
            if (!(password === undefined || password === null || password === "")) {
              _context.next = 6;
              break;
            }

            throw "password is empty";

          case 6:
            if (!(tenant_name === undefined || tenant_name === null || tenant_name === "")) {
              _context.next = 8;
              break;
            }

            throw "tenant_name is empty";

          case 8:
            _context.next = 10;
            return _Tenant2.default.findOne({ name: tenant_name });

          case 10:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 13;
              break;
            }

            throw "tenant is empty";

          case 13:
            _context.next = 15;
            return _User2.default.findOne({ account_name: account_name, tenant_id: tenant._id });

          case 15:
            user = _context.sent;

            if (!(user === null)) {
              _context.next = 18;
              break;
            }

            throw "user is empty";

          case 18:
            if (!(user.enabled === false)) {
              _context.next = 20;
              break;
            }

            throw "user is disabled";

          case 20:
            hash = _crypto2.default.createHash("sha512").update(password).digest("hex");

            if (!(user.password !== hash)) {
              _context.next = 23;
              break;
            }

            throw "password is invalid";

          case 23:
            _tenant = (0, _extends3.default)({}, tenant.toObject());
            _context.next = 26;
            return (0, _files.checkFilePermission)(_tenant.trash_dir_id, (0, _extends3.default)({}, user.toObject())._id, constants.PERMISSION_VIEW_LIST);

          case 26:
            _tenant.trash_icon_visibility = _context.sent;
            //ごみ箱アイコンの表示権限有無

            _user = (0, _extends3.default)({}, user.toObject(), { tenant: _tenant });

            delete _user.password;

            _SECURITY_CONF$develo = _server.SECURITY_CONF.development, secretKey = _SECURITY_CONF$develo.secretKey, expiresIn = _SECURITY_CONF$develo.expiresIn;
            token = _jsonwebtoken2.default.sign(_user, secretKey, { expiresIn: expiresIn });


            res.json({
              status: { success: true, message: "ユーザ認証に成功しました" },
              body: { token: token, user: _user }
            });
            _context.next = 57;
            break;

          case 34:
            _context.prev = 34;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "account_name is empty" ? 40 : _context.t1 === "password is empty" ? 42 : _context.t1 === "user is empty" ? 44 : _context.t1 === "password is invalid" ? 46 : _context.t1 === "user is disabled" ? 48 : _context.t1 === "tenant_name is empty" ? 50 : _context.t1 === "tenant is empty" ? 52 : 54;
            break;

          case 40:
            errors.account_name = "アカウント名が空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 56);

          case 42:
            errors.password = "パスワードが空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 56);

          case 44:
            errors.account_name = "アカウント名またはパスワードが不正のため認証に失敗しました";
            return _context.abrupt("break", 56);

          case 46:
            errors.password = "アカウント名またはパスワードが不正のため認証に失敗しました";
            return _context.abrupt("break", 56);

          case 48:
            errors.account_name = "指定されたユーザは現在無効状態のためユーザ認証に失敗しました";
            return _context.abrupt("break", 56);

          case 50:
            errors.tenant_name = "テナント名が空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 56);

          case 52:
            errors.tenant_name = "指定されたテナントが存在しないためユーザ認証に失敗しました";
            return _context.abrupt("break", 56);

          case 54:
            errors.unknown = commons.errorParser(_context.t0);
            return _context.abrupt("break", 56);

          case 56:
            res.status(400).json({
              status: {
                success: false,
                message: "ユーザ認証に失敗しました",
                errors: errors
              }
            });

          case 57:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 34]]);
  }));
};

var verifyToken = exports.verifyToken = function verifyToken(req, res, next) {
  var verifyPromise = function verifyPromise(token) {
    return new Promise(function (resolve, reject) {
      var secretKey = _server.SECURITY_CONF.development.secretKey;


      _jsonwebtoken2.default.verify(token, secretKey, function (err, decoded) {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  };

  (0, _co2.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var token, decoded, user, tenant, _tenant, errors;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            token = req.body.token;

            if (!(token === undefined || token === null || token === "")) {
              _context2.next = 4;
              break;
            }

            throw "token is empty";

          case 4:
            _context2.next = 6;
            return verifyPromise(token);

          case 6:
            decoded = _context2.sent;

            if (!(decoded.enabled === false)) {
              _context2.next = 9;
              break;
            }

            throw "user is disabled";

          case 9:
            _context2.next = 11;
            return _User2.default.findById(decoded._id);

          case 11:
            user = _context2.sent;

            if (!(user === null)) {
              _context2.next = 14;
              break;
            }

            throw "user is empty";

          case 14:
            _context2.next = 16;
            return _Tenant2.default.findOne(user.tenant_id);

          case 16:
            tenant = _context2.sent;
            _tenant = (0, _extends3.default)({}, tenant.toObject());
            _context2.next = 20;
            return (0, _files.checkFilePermission)(_tenant.trash_dir_id, decoded._id, constants.PERMISSION_VIEW_LIST);

          case 20:
            _tenant.trash_icon_visibility = _context2.sent;
            //ごみ箱アイコンの表示権限有無

            user = (0, _extends3.default)({}, user.toObject(), { tenant: _tenant, iat: decoded.iat });
            delete user.password;

            res.json({
              status: { status: "success" },
              body: { user: user }
            });
            _context2.next = 41;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](0);
            errors = {};
            _context2.t1 = _context2.t0;
            _context2.next = _context2.t1 === "token is empty" ? 32 : _context2.t1 === "user is disabled" ? 34 : _context2.t1 === "user is empty" ? 36 : 38;
            break;

          case 32:
            errors.token = "ログイントークンが空のためトークン認証に失敗しました";
            return _context2.abrupt("break", 40);

          case 34:
            errors.token = "指定されたユーザは現在無効状態のためトークン認証に失敗しました";
            return _context2.abrupt("break", 40);

          case 36:
            errors.token = "指定されたユーザ存在しないためトークン認証に失敗しました";
            return _context2.abrupt("break", 40);

          case 38:
            if (_context2.t0.name === "JsonWebTokenError") {
              errors.token = "ログイントークンが不正のためトークン認証に失敗しました";
            } else {
              errors.unknown = commons.errorParser(_context2.t0);
            }
            return _context2.abrupt("break", 40);

          case 40:

            res.status(400).json({
              status: {
                success: false,
                message: "トークン認証に失敗しました",
                errors: errors
              }
            });

          case 41:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 26]]);
  }));
};