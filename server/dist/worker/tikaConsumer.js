"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileBuffer = exports.getTikaResponse = exports.startTikaConsumer = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _worker = _interopRequireDefault(require("../logger/worker"));

var _elasticsearchclient = _interopRequireDefault(require("../elasticsearchclient"));

var _tikaclient = _interopRequireDefault(require("../tikaclient"));

var _Swift = require("../storages/Swift");

var _File = _interopRequireDefault(require("../models/File"));

var constants = _interopRequireWildcard(require("../configs/constants"));

var _kafkaclient = require("../kafkaclient");

var _AppError = require("../errors/AppError");

var _pkgcloud = _interopRequireDefault(require("pkgcloud"));

var _server = require("../configs/server");

var _stream = _interopRequireDefault(require("stream"));

var _fs = _interopRequireDefault(require("fs"));

// debug用
var startTikaConsumer = function startTikaConsumer() {
  var tika_consumer_payloads = [{
    topic: constants.KAFKA_TOPIC_TIKA_NAME //partition: 0, 

  }];
  var tika_consumer = (0, _kafkaclient.getConsumer)(tika_consumer_payloads); // logger.info("tika consumer created", JSON.stringify(tika_consumer_payloads));

  tika_consumer.on('message',
  /*#__PURE__*/
  function () {
    var _ref = (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee(message) {
      var json_message, fileRecord, buffer, tikaResponse;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              //if(message.offset == (message.highWaterOffset -1)){
              console.log('mesage.value: ' + message.value);
              json_message = JSON.parse(message.value);
              _context.next = 5;
              return _File["default"].findById(json_message.file_id);

            case 5:
              fileRecord = _context.sent;

              if (!(fileRecord === null)) {
                _context.next = 8;
                break;
              }

              throw new _AppError.ValidationError("file is empty");

            case 8:
              if (!fileRecord.is_deleted) {
                _context.next = 10;
                break;
              }

              throw new _AppError.ValidationError("file is deleted");

            case 10:
              _context.next = 12;
              return getFileBuffer(json_message.tenant_name, fileRecord);

            case 12:
              buffer = _context.sent;

              if (buffer) {
                _context.next = 15;
                break;
              }

              throw new _AppError.ValidationError("buffer is empty");

            case 15:
              _context.next = 17;
              return getTikaResponse(buffer);

            case 17:
              tikaResponse = _context.sent;

              if (tikaResponse) {
                _context.next = 20;
                break;
              }

              throw new _AppError.ValidationError("tika response is empty");

            case 20:
              _context.next = 22;
              return _elasticsearchclient["default"].updateTextContents(json_message.tenant_id, json_message.file_id, tikaResponse.meta_text, tikaResponse.full_text);

            case 22:
              _context.next = 24;
              return new Promise(function (resolve, reject) {
                tika_consumer.commit(function (error, data) {
                  if (error) reject(error);
                  resolve(data);
                });
              });

            case 24:
              _context.next = 30;
              break;

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);

              _worker["default"].info("tika consumer error: ", JSON.stringify(_context.t0));

            case 30:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 26]]);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  tika_consumer.on('error', function (error) {
    console.log('tika consumer error: ' + error);

    _worker["default"].info("tika consumer error: ", JSON.stringify(error));
  });
};

exports.startTikaConsumer = startTikaConsumer;

var getTikaResponse =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(buffer) {
    var response_meta_text, response_full_text, meta_info, meta_text;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _tikaclient["default"].getMetaInfo(buffer);

          case 2:
            response_meta_text = _context2.sent;
            _context2.next = 5;
            return _tikaclient["default"].getTextInfo(buffer);

          case 5:
            response_full_text = _context2.sent;
            //console.log(response_full_text.text)
            meta_info = JSON.parse(response_meta_text.text);
            meta_text = ''; //meta_info.Content-Type || ''

            return _context2.abrupt("return", {
              full_text: response_full_text.text,
              meta_text: meta_text
            });

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getTikaResponse(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getTikaResponse = getTikaResponse;

var getFileBuffer =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(tenant_name, fileRecord) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return new Promise(
            /*#__PURE__*/
            function () {
              var _ref4 = (0, _asyncToGenerator2["default"])(
              /*#__PURE__*/
              _regenerator["default"].mark(function _callee3(resolve, reject) {
                var swift, bufs, readStream;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        swift = new _Swift.Swift();
                        bufs = [];
                        _context3.next = 4;
                        return swift.downloadFile(tenant_name, fileRecord);

                      case 4:
                        readStream = _context3.sent;
                        readStream.on("data", function (data) {
                          return bufs.push(data);
                        });
                        readStream.on("end", function () {
                          return resolve(Buffer.concat(bufs));
                        });
                        readStream.on("error", function (err) {
                          return reject(err);
                        });

                      case 8:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x5, _x6) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 2:
            return _context4.abrupt("return", _context4.sent);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getFileBuffer(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getFileBuffer = getFileBuffer;