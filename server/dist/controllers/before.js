"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _co = _interopRequireDefault(require("co"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var commons = _interopRequireWildcard(require("./commons"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _url = _interopRequireDefault(require("url"));

var _User = _interopRequireDefault(require("../models/User"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var _AuthorityMenu = _interopRequireDefault(require("../models/AuthorityMenu"));

var _server = require("../configs/server");

// models
var verifyToken = function verifyToken(req, res, next) {
  // jwt.vefifyはasyncかつpromiseを返却しない
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
  _regenerator["default"].mark(function _callee() {
    var authHeader, decoded, user, _user, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            authHeader = req.headers["x-auth-cloud-storage"];

            if (!(authHeader === undefined || authHeader === null || authHeader === "")) {
              _context.next = 4;
              break;
            }

            throw "token is empty";

          case 4:
            _context.next = 6;
            return verifyPromise(authHeader);

          case 6:
            decoded = _context.sent;
            _context.next = 9;
            return _User["default"].findById(decoded._id);

          case 9:
            user = _context.sent;

            if (!(user === null)) {
              _context.next = 12;
              break;
            }

            throw "user is empty";

          case 12:
            _user = user.toObject();
            _context.next = 15;
            return _Tenant["default"].findById(user.tenant_id);

          case 15:
            _user.tenant = _context.sent;
            res.user = _user; // TODO:
            // // メニュー権限による制御
            // let requestReferer = "";
            // if(req.headers.referer !== undefined) {
            //   requestReferer = ((url.parse(req.headers.referer)).path.split("/"))[1];
            // }
            // // filesからのリクエストもhomeと同様に扱う
            // if(requestReferer === constants.PERMISSION_FILES) requestReferer = constants.PERMISSION_HOME;
            // const condition = {
            //   $or:[
            //     { users: user._id },
            //     { groups: {$in: user.groups } }
            //   ]
            // };
            // const menus = yield AuthorityMenu.getMenus(condition);
            // let auth = false;
            // menus.forEach( (menu) => {
            //   if(menu.name === requestReferer) auth = true;
            // });
            // if(auth === false) throw "permission denied";

            next();
            _context.next = 35;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = _context.t1 === "token is empty" ? 26 : _context.t1 === "user is empty" ? 28 : _context.t1 === "permission denied" ? 30 : 32;
            break;

          case 26:
            errors.token = "トークンが空のため検証に失敗";
            return _context.abrupt("break", 34);

          case 28:
            errors.user = "トークンからユーザ情報を取得したが空のためエラー";
            return _context.abrupt("break", 34);

          case 30:
            errors.permission = "アクセス権限がありません";
            return _context.abrupt("break", 34);

          case 32:
            if (_context.t0.message === "jwt malformed" && _context.t0.name === "JsonWebTokenError") {
              errors.token = "トークンの復号処理に失敗";
            } else {
              errors.unknown = commons.errorParser(_context.t0);
            }

            return _context.abrupt("break", 34);

          case 34:
            res.status(400).json({
              status: {
                success: false,
                message: "トークンの検証に失敗",
                errors: errors
              }
            });

          case 35:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 20]]);
  }));
};

exports.verifyToken = verifyToken;