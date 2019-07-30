"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.authentication = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _co = _interopRequireDefault(require("co"));

var _crypto = _interopRequireDefault(require("crypto"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _util = _interopRequireDefault(require("util"));

var commons = _interopRequireWildcard(require("./commons"));

var _server = require("../configs/server");

var _User = _interopRequireDefault(require("../models/User"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var _files = require("./files");

var constants = _interopRequireWildcard(require("../configs/constants"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var authentication = function authentication(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var _req$body, account_name, password, tenant_name, tenant, user, hash, _tenant, _user, _SECURITY_CONF$develo, secretKey, expiresIn, token, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
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
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 10:
            tenant = _context.sent;

            if (!(tenant === null)) {
              _context.next = 13;
              break;
            }

            throw "tenant is empty";

          case 13:
            _context.next = 15;
            return _User["default"].findOne({
              account_name: account_name,
              tenant_id: tenant._id
            });

          case 15:
            user = _context.sent;

            if (!(user === null)) {
              _context.next = 18;
              break;
            }

            throw "user is empty";

          case 18:
            if (!(user.deleted === true)) {
              _context.next = 20;
              break;
            }

            throw "user is deleted";

          case 20:
            if (!(user.enabled === false)) {
              _context.next = 22;
              break;
            }

            throw "user is disabled";

          case 22:
            hash = _crypto["default"].createHash("sha512").update(password).digest("hex");

            if (!(user.password !== hash)) {
              _context.next = 25;
              break;
            }

            throw "password is invalid";

          case 25:
            _tenant = _objectSpread({}, tenant.toObject());
            _context.next = 28;
            return (0, _files.checkFilePermission)(_tenant.trash_dir_id, _objectSpread({}, user.toObject())._id, constants.PERMISSION_VIEW_LIST);

          case 28:
            _tenant.trash_icon_visibility = _context.sent;
            //ごみ箱アイコンの表示権限有無
            _user = _objectSpread({}, user.toObject(), {
              tenant: _tenant
            });
            delete _user.password;
            _SECURITY_CONF$develo = _server.SECURITY_CONF.development, secretKey = _SECURITY_CONF$develo.secretKey, expiresIn = _SECURITY_CONF$develo.expiresIn;
            token = _jsonwebtoken["default"].sign(_user, secretKey, {
              expiresIn: expiresIn
            });
            res.json({
              status: {
                success: true,
                message: "ユーザ認証に成功しました"
              },
              body: {
                token: token,
                user: _user
              }
            });
            _context.next = 61;
            break;

          case 36:
            _context.prev = 36;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "account_name is empty" ? 42 : _context.t1 === "password is empty" ? 44 : _context.t1 === "user is empty" ? 46 : _context.t1 === "password is invalid" ? 48 : _context.t1 === "user is disabled" ? 50 : _context.t1 === "user is deleted" ? 52 : _context.t1 === "tenant_name is empty" ? 54 : _context.t1 === "tenant is empty" ? 56 : 58;
            break;

          case 42:
            errors.account_name = "アカウント名が空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 60);

          case 44:
            errors.password = "パスワードが空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 60);

          case 46:
            errors.account_name = "アカウント名またはパスワードが不正のため認証に失敗しました";
            return _context.abrupt("break", 60);

          case 48:
            errors.password = "アカウント名またはパスワードが不正のため認証に失敗しました";
            return _context.abrupt("break", 60);

          case 50:
            errors.account_name = "指定されたユーザは現在無効状態のためユーザ認証に失敗しました";
            return _context.abrupt("break", 60);

          case 52:
            errors.account_name = "指定されたユーザは削除されています";
            return _context.abrupt("break", 60);

          case 54:
            errors.tenant_name = "テナント名が空のためユーザ認証に失敗しました";
            return _context.abrupt("break", 60);

          case 56:
            errors.tenant_name = "指定されたテナントが存在しないためユーザ認証に失敗しました";
            return _context.abrupt("break", 60);

          case 58:
            errors.unknown = commons.errorParser(_context.t0);
            return _context.abrupt("break", 60);

          case 60:
            res.status(400).json({
              status: {
                success: false,
                message: "ユーザ認証に失敗しました",
                errors: errors
              }
            });

          case 61:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 36]]);
  }));
};

exports.authentication = authentication;

var verifyToken = function verifyToken(req, res, next) {
  var verifyPromise = function verifyPromise(token) {
    return new Promise(function (resolve, reject) {
      var secretKey = _server.SECURITY_CONF.development.secretKey;

      _jsonwebtoken["default"].verify(token, secretKey, function (err, decoded) {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  };

  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    var token, decoded, user, tenant, _tenant, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
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
            return _User["default"].findById(decoded._id);

          case 11:
            user = _context2.sent;

            if (!(user === null)) {
              _context2.next = 14;
              break;
            }

            throw "user is empty";

          case 14:
            _context2.next = 16;
            return _Tenant["default"].findOne(user.tenant_id);

          case 16:
            tenant = _context2.sent;
            _tenant = _objectSpread({}, tenant.toObject());
            _context2.next = 20;
            return (0, _files.checkFilePermission)(_tenant.trash_dir_id, decoded._id, constants.PERMISSION_VIEW_LIST);

          case 20:
            _tenant.trash_icon_visibility = _context2.sent;
            //ごみ箱アイコンの表示権限有無
            user = _objectSpread({}, user.toObject(), {
              tenant: _tenant,
              iat: decoded.iat
            });
            delete user.password;
            res.json({
              status: {
                status: "success"
              },
              body: {
                user: user
              }
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
    }, _callee2, null, [[0, 26]]);
  }));
};

exports.verifyToken = verifyToken;