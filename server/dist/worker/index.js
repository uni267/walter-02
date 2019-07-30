"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _worker = _interopRequireDefault(require("../logger/worker"));

var _events = require("events");

var _checkServices = require("../checkServices");

var _tikaConsumer = require("./tikaConsumer");

var _AppSetting = _interopRequireDefault(require("../models/AppSetting"));

// worker process のダウン検知
process.on('uncaughtException', function (err) {
  console.log('uncaughtException => ' + err);

  _worker["default"].info("uncaughtException", JSON.stringify(err));
});
console.log("checking conections ...");

_worker["default"].info("checking conections ...");

var event = new _events.EventEmitter();
var status = {};
var fullTextSetting; // mongo, swift, elasticsearch, kafka, tikaのヘルスチェックが完了通知を受け取ったらappを起動する

event.on("success",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(middleware_name) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            status[middleware_name] = true;

            if (!(middleware_name === 'mongo')) {
              _context.next = 6;
              break;
            }

            _context.next = 4;
            return _AppSetting["default"].findOne({
              //tenant_id: res.user.tenant_id,
              name: _AppSetting["default"].FULL_TEXT_SEARCH_ENABLED
            });

          case 4:
            fullTextSetting = _context.sent;

            if (fullTextSetting && fullTextSetting.enable) {
              //全文検索オプションがONの時
              (0, _checkServices.checkTika)(process_checked('tika'));
              (0, _checkServices.checkKafka)(process_checked('kafka'));
            } else {
              status.tika = true;
              status.kafka = true;
            }

          case 6:
            if (status.mongo && status.swift && status.elastic && status.kafka && status.tika) {
              //ここがメイン処理
              if (fullTextSetting && fullTextSetting.enable) {
                console.log("starting worker ...");

                _worker["default"].info("starting worker ...");

                (0, _tikaConsumer.startTikaConsumer)(); // tika用メッセージリスナーを開始
              }
            }

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

var process_checked = function process_checked(middleware_name) {
  return function () {
    console.log("".concat(middleware_name, " connection success"));

    _worker["default"].info("".concat(middleware_name, " connection success"));

    event.emit("success", middleware_name);
  };
};

try {
  (0, _checkServices.checkMongo)(process_checked('mongo'));
  (0, _checkServices.checkSwift)(process_checked('swift'));
  (0, _checkServices.checkElastic)(process_checked('elastic'));
  (0, _checkServices.checkTika)(process_checked('tika')); //全文検索オプションがONの時

  (0, _checkServices.checkKafka)(process_checked('kafka'));
} catch (e) {
  _worker["default"].error(e);

  process.exit();
}