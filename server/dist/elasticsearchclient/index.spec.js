"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _ = _interopRequireWildcard(require("lodash"));

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var test_helper = _interopRequireWildcard(require("../test/helper"));

var _Swift = require("../storages/Swift");

var _index = _interopRequireDefault(require("./index"));

//import defaults from "superagentdefaults";
describe("elasticsearchclientのテスト", function () {
  var __searchTextContents =
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(tenant_id, file_id) {
      var result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _index["default"].search({
                index: tenant_id,
                type: "files",
                body: {
                  "query": {
                    "term": {
                      "_id": file_id
                    }
                  }
                }
              });

            case 2:
              result = _context.sent;
              return _context.abrupt("return", {
                result_full_text: result.hits.hits[0]._source.file.full_text,
                result_meta_text: result.hits.hits[0]._source.file.meta_text
              });

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function __searchTextContents(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  describe("updateTextContents()",
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee11() {
    var tenant_id, file_id, full_text, meta_text;
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            tenant_id = '5cbea3de04b71c01f769627a';
            file_id = '5cc00e200f0b1d44403e5b33';
            full_text = 'happy?';
            meta_text = 'yes!';
            before(
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee2() {
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })));
            after(
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee3() {
              return _regenerator["default"].wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            })));
            it("ascii\u5024\u3067\u66F4\u65B0",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee4() {
              var file;
              return _regenerator["default"].wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      full_text = 'happy?';
                      meta_text = 'yes!';
                      _context4.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context4.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context4.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context4.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            })));
            it("null\u5024\u3067\u66F4\u65B0",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee5() {
              var file;
              return _regenerator["default"].wrap(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      full_text = null;
                      meta_text = null;
                      _context5.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context5.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context5.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context5.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, _callee5);
            })));
            it("\u65E5\u672C\u8A9E\u5024\u3067\u66F4\u65B0",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee6() {
              var file;
              return _regenerator["default"].wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      full_text = "日本語も";
                      meta_text = "大丈夫！";
                      _context6.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context6.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context6.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context6.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, _callee6);
            })));
            it(" \" \u306E\u30A8\u30B9\u30B1\u30FC\u30D7",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee7() {
              var file;
              return _regenerator["default"].wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      full_text = '"';
                      meta_text = '"';
                      _context7.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context7.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context7.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context7.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee7);
            })));
            it(" ' \u306E\u30A8\u30B9\u30B1\u30FC\u30D7",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee8() {
              var file;
              return _regenerator["default"].wrap(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      full_text = "'";
                      meta_text = "'";
                      _context8.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context8.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context8.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context8.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _callee8);
            })));
            it(" ` のエスケープ",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee9() {
              var file;
              return _regenerator["default"].wrap(function _callee9$(_context9) {
                while (1) {
                  switch (_context9.prev = _context9.next) {
                    case 0:
                      full_text = '`';
                      meta_text = "`";
                      _context9.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context9.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context9.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context9.sent;
                      (0, _chai.expect)(full_text).equal(file.full_text);
                      (0, _chai.expect)(meta_text).equal(file.meta_text);

                    case 11:
                    case "end":
                      return _context9.stop();
                  }
                }
              }, _callee9);
            })));
            it.only("連続するスペースを単一スペースに置換",
            /*#__PURE__*/
            (0, _asyncToGenerator2["default"])(
            /*#__PURE__*/
            _regenerator["default"].mark(function _callee10() {
              var file;
              return _regenerator["default"].wrap(function _callee10$(_context10) {
                while (1) {
                  switch (_context10.prev = _context10.next) {
                    case 0:
                      full_text = ' aaa   bb cccc  ';
                      meta_text = 'dd ee fff';
                      _context10.next = 4;
                      return _index["default"].updateTextContents(tenant_id, file_id, meta_text, full_text);

                    case 4:
                      _context10.next = 6;
                      return test_helper.sleep(3000);

                    case 6:
                      _context10.next = 8;
                      return _index["default"].getFile(tenant_id, file_id);

                    case 8:
                      file = _context10.sent;
                      (0, _chai.expect)(file.full_text).equal(' aaa bb cccc ');
                      (0, _chai.expect)(file.meta_text).equal('dd ee fff');

                    case 11:
                    case "end":
                      return _context10.stop();
                  }
                }
              }, _callee10);
            })));

          case 13:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  })));
});