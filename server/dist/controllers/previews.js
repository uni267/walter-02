"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _logger = require("../logger");

var _Preview = _interopRequireDefault(require("../models/Preview"));

// models
var image = function image(req, res, next) {
  (0, _co["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var preview_id, preview;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            preview_id = req.params.preview_id;
            _context.next = 4;
            return _Preview["default"].findById(preview_id);

          case 4:
            preview = _context.sent;
            res.json({
              status: {
                success: true
              },
              body: preview.image.buffer.toString("base64")
            });
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);

            _logger.logger.error(_context.t0);

            res.status(404).send('Not Found');

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
};

exports.image = image;