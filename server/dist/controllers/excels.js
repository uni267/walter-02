"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchDetail = exports.search = exports.index = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _express = require("express");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _co = _interopRequireDefault(require("co"));

var _exceljs = _interopRequireDefault(require("exceljs"));

var _lodash = require("lodash");

var _logger = _interopRequireDefault(require("../logger"));

var filesController = _interopRequireWildcard(require("./files"));

var displayItemsController = _interopRequireWildcard(require("./displayItems"));

var _Tag = _interopRequireDefault(require("../models/Tag"));

var _RoleFile = _interopRequireDefault(require("../models/RoleFile"));

// controllers
// models
var router = (0, _express.Router)();

var index =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res, next) {
    var files, displayItems, tags, roles, readStream, errors;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return filesController.index(req, res, next, true, true);

          case 3:
            files = _context.sent;
            _context.next = 6;
            return displayItemsController.excel(req, res, next, true);

          case 6:
            displayItems = _context.sent;
            _context.next = 9;
            return _Tag["default"].find({
              $or: [{
                tenant_id: res.user.tenant_id
              }, {
                user_id: res.user._id
              }]
            });

          case 9:
            tags = _context.sent;
            _context.next = 12;
            return _RoleFile["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 12:
            roles = _context.sent;
            _context.next = 15;
            return exportExcelBook(displayItems, tags, roles, files);

          case 15:
            readStream = _context.sent;

            _fs["default"].createReadStream(readStream.path).on("data", function (data) {
              return res.write(data);
            }).on("end", function () {
              return res.end();
            });

            _context.next = 29;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](0);
            // TODO: エラー処理を追加する
            errors = {};
            _context.t1 = _context.t0;
            _context.next = 25;
            break;

          case 25:
            errors.unknown = _context.t0;
            return _context.abrupt("break", 27);

          case 27:
            _logger["default"].error(_context.t0);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 19]]);
  }));

  return function index(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.index = index;

var search =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res, next) {
    var files, displayItems, tags, roles, readStream, errors;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return filesController.search(req, res, next, true);

          case 3:
            files = _context2.sent;
            _context2.next = 6;
            return displayItemsController.excel(req, res, next, true);

          case 6:
            displayItems = _context2.sent;
            _context2.next = 9;
            return _Tag["default"].find({
              $or: [{
                tenant_id: res.user.tenant_id
              }, {
                user_id: res.user._id
              }]
            });

          case 9:
            tags = _context2.sent;
            _context2.next = 12;
            return _RoleFile["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 12:
            roles = _context2.sent;
            _context2.next = 15;
            return exportExcelBook(displayItems, tags, roles, files);

          case 15:
            readStream = _context2.sent;

            _fs["default"].createReadStream(readStream.path).on("data", function (data) {
              return res.write(data);
            }).on("end", function () {
              return res.end();
            });

            _context2.next = 29;
            break;

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](0);
            // TODO: エラー処理を追加する
            errors = {};
            _context2.t1 = _context2.t0;
            _context2.next = 25;
            break;

          case 25:
            errors.unknown = _context2.t0;
            return _context2.abrupt("break", 27);

          case 27:
            _logger["default"].error(_context2.t0);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 29:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 19]]);
  }));

  return function search(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.search = search;

var searchDetail =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var files, displayItems, tags, roles, readStream, errors;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return filesController.searchDetail(req, res, next, true);

          case 3:
            files = _context3.sent;
            _context3.next = 6;
            return displayItemsController.excel(req, res, next, true);

          case 6:
            displayItems = _context3.sent;
            _context3.next = 9;
            return _Tag["default"].find({
              $or: [{
                tenant_id: res.user.tenant_id
              }, {
                user_id: res.user._id
              }]
            });

          case 9:
            tags = _context3.sent;
            _context3.next = 12;
            return _RoleFile["default"].find({
              tenant_id: res.user.tenant_id
            });

          case 12:
            roles = _context3.sent;
            _context3.next = 15;
            return exportExcelBook(displayItems, tags, roles, files);

          case 15:
            readStream = _context3.sent;

            _fs["default"].createReadStream(readStream.path).on("data", function (data) {
              return res.write(data);
            }).on("end", function () {
              return res.end();
            });

            _context3.next = 29;
            break;

          case 19:
            _context3.prev = 19;
            _context3.t0 = _context3["catch"](0);
            // TODO: エラー処理を追加する
            errors = {};
            _context3.t1 = _context3.t0;
            _context3.next = 25;
            break;

          case 25:
            errors.unknown = _context3.t0;
            return _context3.abrupt("break", 27);

          case 27:
            _logger["default"].error(_context3.t0);

            res.status(400).json({
              status: {
                success: false,
                errors: errors
              }
            });

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 19]]);
  }));

  return function searchDetail(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}(); // private ---


exports.searchDetail = searchDetail;

var exportExcelBook =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(displayItems, tags, roles, files) {
    var workbook, worksheet, fill_styles_header, fill_color, fill_styles_body_odd, fill_styles_body_even, cel_width, headers, header_timestamps, header_tags, header_authority, column, j, col, fill_style, i, line, _loop, _j, stream;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            workbook = new _exceljs["default"].Workbook();
            worksheet = workbook.addWorksheet('ファイル一覧');
            fill_styles_header = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'CCCCCC'
              }
            };
            fill_color = {
              "default": 'CCCCCC',
              meta: 'CCCCCC',
              tag: 'CCCCCC',
              role: '8ee0ea'
            };
            fill_styles_body_odd = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'ffffff'
              }
            };
            fill_styles_body_even = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: {
                argb: 'EFEFEF'
              }
            };
            cel_width = 20;
            headers = displayItems.filter(function (item) {
              return item.name !== 'file_checkbox' && item.name !== 'action' && item.name !== "authorities" && item.name !== "tag";
            }).map(function (item) {
              if (item.meta_info_id === null) {
                return {
                  name: item.name,
                  label: item.label,
                  type: "default"
                };
              } else {
                return {
                  name: item.name,
                  label: item.label,
                  meta_info_id: item.meta_info_id,
                  type: "meta"
                };
              }
            }); // timestampが出力対象の場合

            header_timestamps = [];

            if (true) {}

            header_tags = []; // tagが出力対象の場合

            if ((0, _lodash.findIndex)(displayItems, {
              name: "tag"
            }) >= 0) {
              header_tags = tags.map(function (tag) {
                var color = tag.color.replace('#', '');

                if (color.length === 3) {
                  color = color.replace(/([0-9a-zA-Z])([0-9a-zA-Z])([0-9a-zA-Z])/g, "$1$1$2$2$3$3");
                }

                return {
                  name: "tags",
                  label: tag.label,
                  type: "tag",
                  tag_id: tag._id,
                  color: color
                };
              });
            } // console.log(roles);


            header_authority = [];

            if ((0, _lodash.findIndex)(displayItems, {
              name: "authorities"
            }) >= 0) {
              header_authority = roles.map(function (role) {
                return {
                  name: "roles",
                  label: role.name,
                  type: "role",
                  role_id: role._id
                };
              });
            }

            column = [].concat((0, _toConsumableArray2["default"])(headers), (0, _toConsumableArray2["default"])(header_authority), (0, _toConsumableArray2["default"])(header_tags)); // console.log(column);
            // header

            for (j = 0; j < column.length; j++) {
              col = j + 1;
              worksheet.getCell(1, col).value = column[j].label;
              fill_style = {
                type: fill_styles_header.type,
                pattern: fill_styles_header.pattern,
                fgColor: column[j].type === "tag" ? {
                  argb: column[j].color
                } : {
                  argb: fill_color[column[j].type]
                }
              };
              worksheet.getCell(1, col).fill = fill_style;
              worksheet.getCell(1, col).border = {
                bottom: {
                  style: "thin"
                }
              };
              worksheet.getColumn(col).width = cel_width;
              worksheet.getCell(1, col).alignment = {
                vertical: 'middle',
                horizontal: 'center'
              };
            } // body


            for (i = 0; i < files.length; i++) {
              line = i + 2;

              _loop = function _loop(_j) {
                var value = "";

                switch (column[_j].type) {
                  case "meta":
                    var meta = (0, _lodash.find)(files[i].meta_infos, {
                      _id: column[_j].meta_info_id
                    });
                    value = meta === undefined ? "" : meta.value;
                    break;

                  case "tag":
                    value = (0, _lodash.findIndex)(files[i].tags, {
                      _id: column[_j].tag_id
                    }) >= 0 ? "○" : "";
                    break;

                  case "role":
                    var file_role = files[i].authorities.filter(function (authority) {
                      return authority.role_files._id.toString() === column[_j].role_id.toString();
                    }).map(function (authority) {
                      return authority.users === undefined ? "" : authority.users.name;
                    }).join();
                    value = file_role;
                    break;

                  default:
                    value = (0, _lodash.get)(files[i], column[_j].name);
                    break;
                }

                if (column[_j].name === "dir_route" && value === "") value = "Top";
                var col = _j + 1;
                worksheet.getCell(line, col).value = value;
                worksheet.getCell(line, col).fill = line % 2 === 0 ? fill_styles_body_even : fill_styles_body_odd;
              };

              for (_j = 0; _j < column.length; _j++) {
                _loop(_j);
              }
            } //出力


            stream = _fs["default"].createWriteStream("/tmp/stream.tmp");
            _context4.next = 20;
            return workbook.xlsx.write(stream);

          case 20:
            return _context4.abrupt("return", stream);

          case 21:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function exportExcelBook(_x10, _x11, _x12, _x13) {
    return _ref4.apply(this, arguments);
  };
}();