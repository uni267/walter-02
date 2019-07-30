"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _lodash = _interopRequireDefault(require("lodash"));

var _Action = _interopRequireDefault(require("../models/Action"));

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

var index =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var actions, timestampPerm, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _Action["default"].find();

          case 3:
            actions = _context.sent;
            _context.next = 6;
            return _AppSetting["default"].findOne({
              tenant_id: res.user.tenant_id,
              name: _AppSetting["default"].TIMESTAMP_PERMISSION
            });

          case 6:
            timestampPerm = _context.sent;

            if (!timestampPerm || !timestampPerm.enable) {
              actions = _lodash["default"].reject(actions, function (_ref2) {
                var name = _ref2.name;
                return name === "auto-timestamp" || name === "verify-timestamp" || name === "add-timestamp";
              });
            }

            res.json({
              status: {
                success: true
              },
              body: actions
            });
            _context.next = 20;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            errors = {};
            _context.t1 = _context.t0;
            _context.next = 17;
            break;

          case 17:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 19);

          case 19:
            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function index(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.index = index;