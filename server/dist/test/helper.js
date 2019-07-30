"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUUID = exports.getUser = exports.sleep = exports.loadResourceFile = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var fs = _interopRequireWildcard(require("fs"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

var loadResourceFile = function loadResourceFile(name) {
  return fs.readFileSync("./lib/test/resources/" + name);
};

exports.loadResourceFile = loadResourceFile;

var sleep = function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  });
};

exports.sleep = sleep;

var getUser =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tenant_name, account_name) {
    var tenant, user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 2:
            tenant = _context.sent;
            _context.next = 5;
            return _Tenant["default"].findOne({
              tenant_id: tenant.id.toString(),
              account_name: account_name
            });

          case 5:
            user = _context.sent;
            return _context.abrupt("return", user);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.getUser = getUser;

var getUUID = function getUUID() {
  // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
  // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  var chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");

  for (var i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;

      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }

  return chars.join("");
};

exports.getUUID = getUUID;