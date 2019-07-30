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

var constants = _interopRequireWildcard(require("../configs/constants"));

var _kafkaclient = require("../kafkaclient");

var _tikaConsumer = require("./tikaConsumer");

var _checkServices = require("../checkServices");

var _Swift = require("../storages/Swift");

describe("tikaConsumerのテスト", function () {
  var topic_single_partition = 'topic_unit_test_single_partition';
  var topic_double_partition = 'topic_unit_test_double_partition';
  describe("startTikaConsumer()", function () {
    var createTikaMessage =
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(tenant_id, tenant_name, file_id) {
        var partition, payloads, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                partition = 0;
                payloads = [{
                  topic: 'tika',
                  partition: partition,
                  messages: JSON.stringify({
                    tenant_id: tenant_id,
                    tenant_name: tenant_name,
                    file_id: file_id
                  })
                }];
                _context.next = 4;
                return (0, _kafkaclient.produce)(payloads);

              case 4:
                result = _context.sent;

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function createTikaMessage(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }();

    before(function () {});
    after(function () {});
    it("\u901A\u5E38\u5B9F\u884C",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return createTikaMessage('5cbecc307bebf72fc44a8a1c', 'wakayama', '5cbecc307bebf72fc44a8a1c');

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  describe("getTikaResponse()", function () {
    before(function () {});
    after(function () {});
    it("pdf\u3092\u6E21\u3059",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3() {
      var pdfFile, response;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              pdfFile = test_helper.loadResourceFile('jicfs.pdf');
              _context3.next = 3;
              return (0, _tikaConsumer.getTikaResponse)(pdfFile);

            case 3:
              response = _context3.sent;
              (0, _chai.expect)(response.full_text).match(/JICFS分類漢字分類名/);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  describe("getFileBuffer()", function () {
    var tenant_name = 'wakayama';
    var uuid = test_helper.getUUID();
    before(
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      var swift, pdfFile;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              swift = new _Swift.Swift();
              pdfFile = test_helper.loadResourceFile('jicfs.pdf');
              _context4.next = 4;
              return swift.upload(tenant_name, pdfFile, uuid);

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it("\u6B63\u5E38\u53D6\u5F97",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5() {
      var buffer;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _tikaConsumer.getFileBuffer)(tenant_name, {
                _id: uuid,
                is_crypted: false
              });

            case 2:
              buffer = _context5.sent;
              (0, _chai.expect)(buffer).to.not.be["null"];
              (0, _chai.expect)(buffer.length).equal(135414); //jicfs.pdfのサイズ

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
  });
});