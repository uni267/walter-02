"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _moment = _interopRequireDefault(require("moment"));

var _ = _interopRequireWildcard(require("lodash"));

var _supertest = _interopRequireDefault(require("supertest"));

var _chai = require("chai");

var test_helper = _interopRequireWildcard(require("../test/helper"));

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

var _index = require("./index");

describe("kafkaclientのテスト", function () {
  var topic_single_partition = 'topic_unit_test_single_partition';
  var topic_double_partition = 'topic_unit_test_double_partition';
  describe("kafkaClient()", function () {
    before(function () {});
    after(function () {});
    it("producer topics\u4F5C\u6210",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _index.createTopics)([{
                topic: topic_single_partition,
                partitions: 1,
                replicationFactor: 1
              }, {
                topic: topic_double_partition,
                partitions: 2,
                replicationFactor: 1
              }]);

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it("producer \u5358\u72EC\u30AD\u30E5\u30FC\u9001\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2() {
      var partition, uuid, payloads, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              partition = 0;
              uuid = test_helper.getUUID();
              payloads = [{
                key: 'theKey',
                topic: topic_double_partition,
                partition: partition,
                messages: JSON.stringify({
                  file_id: uuid
                })
              }];
              _context2.next = 5;
              return (0, _index.produce)(payloads);

            case 5:
              result = _context2.sent;
              (0, _chai.expect)(result[topic_double_partition][partition]).to.not.be.undefined;

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it("producer tika\u30E1\u30C3\u30BB\u30FC\u30B8\u9001\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3() {
      var partition, payloads, result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              partition = 0;
              payloads = [{
                topic: 'tika',
                partition: partition,
                messages: JSON.stringify({
                  tenant_name: 'wakayama',
                  file_id: '5cbe6712b3136e00322f3bf4'
                })
              }];
              _context3.next = 4;
              return (0, _index.produce)(payloads);

            case 4:
              result = _context3.sent;
              (0, _chai.expect)(result[topic_double_partition][partition]).to.not.be.undefined;

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it("producer \u4E0D\u660E\u306Atopic\u3078\u9001\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      var uuid, payloads, result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              uuid = test_helper.getUUID();
              payloads = [{
                topic: '????????',
                messages: JSON.stringify({
                  file_id: uuid
                })
              }];
              _context4.prev = 2;
              _context4.next = 5;
              return (0, _index.produce)(payloads);

            case 5:
              result = _context4.sent;
              (0, _chai.expect)("ここが評価されるのはNG").to.be["null"];
              _context4.next = 12;
              break;

            case 9:
              _context4.prev = 9;
              _context4.t0 = _context4["catch"](2);
              (0, _chai.expect)(_context4.t0.message).equal('InvalidTopic');

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[2, 9]]);
    })));
    it.only("producer \u5B58\u5728\u3057\u306A\u3044\u30DB\u30B9\u30C8\u306B\u9001\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5() {
      var partition, uuid, payloads, config, result;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              partition = 0;
              uuid = test_helper.getUUID();
              payloads = [{
                topic: topic_double_partition,
                messages: JSON.stringify({
                  file_id: uuid
                })
              }];
              config = {
                kafkaHost: 'localhost:9092',
                connectTimeout: 1000
              };
              _context5.prev = 4;
              _context5.next = 7;
              return (0, _index.produce)(payloads, config);

            case 7:
              result = _context5.sent;
              (0, _chai.expect)("ここが評価されるのはNG").to.be["null"];
              _context5.next = 14;
              break;

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](4);
              (0, _chai.expect)(_context5.t0.message).equal('InvalidTopic');

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[4, 11]]);
    })));
    it("producer \u8907\u6570\u30AD\u30E5\u30FC\u9001\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee6() {
      var uuids, payloads, result;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              uuids = [test_helper.getUUID(), test_helper.getUUID(), test_helper.getUUID()];
              payloads = uuids.map(function (uuid) {
                return {
                  topic: topic_double_partition,
                  partition: 1,
                  messages: "message ".concat(uuid)
                };
              });
              _context6.next = 4;
              return (0, _index.produce)([].concat((0, _toConsumableArray2["default"])(payloads), [{
                topic: topic_single_partition,
                partition: 0,
                messages: ["message test1!!!", "message test2!!!"]
              }]));

            case 4:
              result = _context6.sent;
              (0, _chai.expect)(result).to.have.property(topic_double_partition);
              (0, _chai.expect)(result).to.have.property(topic_single_partition);

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it("consumer \u5358\u4E00\u53D7\u4FE1",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee8() {
      var payloads, consumer;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              payloads = [{
                topic: topic_single_partition,
                partition: 0
              }];
              consumer = (0, _index.getConsumer)(payloads);
              consumer.on('message',
              /*#__PURE__*/
              function () {
                var _ref8 = (0, _asyncToGenerator2["default"])(
                /*#__PURE__*/
                _regenerator["default"].mark(function _callee7(message) {
                  return _regenerator["default"].wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          console.log(message);

                          if (!(message.offset == message.highWaterOffset - 1)) {
                            _context7.next = 4;
                            break;
                          }

                          _context7.next = 4;
                          return (0, _index.closeConsumer)(consumer);

                        case 4:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7);
                }));

                return function (_x) {
                  return _ref8.apply(this, arguments);
                };
              }());
              consumer.on('error', function (err) {
                (0, _chai.expect)("errorが発生").to.be["null"];
              });

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
  });
});