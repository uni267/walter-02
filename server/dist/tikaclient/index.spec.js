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

var _index = _interopRequireDefault(require("./index"));

//import defaults from "superagentdefaults";
describe("tikaclientのテスト", function () {
  var pdfFile = test_helper.loadResourceFile('sample.pdf');
  describe("tikaClient()", function () {
    var tenant_id = '5cb02dd57faea500c6a0acb7';
    var file_id = '5cb03ac534679e36881995d4';
    beforeEach(function () {});
    it("getTextInfo",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee() {
      var result, matched;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _index["default"].getTextInfo(pdfFile);

            case 2:
              result = _context.sent;
              matched = result.text.match(/メーカープライベートコード/);
              (0, _chai.expect)(matched).to.not.be["null"];

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("getMetaInfo",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2() {
      var result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _index["default"].getMetaInfo(pdfFile);

            case 2:
              result = _context2.sent;
              (0, _chai.expect)(JSON.parse(result.text).producer).equal("LibreOffice 6.2");

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
});