"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _initDatabase = _interopRequireDefault(require("../batches/tasks/initDatabase"));

var _addTenant = _interopRequireDefault(require("../batches/tasks/addTenant"));

var _mongodbMemoryServer = require("mongodb-memory-server");

var _moment = _interopRequireDefault(require("moment"));

var _ = _interopRequireWildcard(require("lodash"));

var _Swift = require("../storages/Swift");

var controller = _interopRequireWildcard(require("../controllers/files"));

var _User = _interopRequireDefault(require("../models/User"));

var _Tenant = _interopRequireDefault(require("../models/Tenant"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

jest.setTimeout(20000);
var tenant_name = 'test';
describe('lib/controllers/files', function () {
  var mongoServer;
  var opts = {
    useNewUrlParser: true
  }; // remove this option if you use mongoose 5 and above  

  var tenant;
  var user;
  beforeAll(
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var mongoUri;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mongoServer = new _mongodbMemoryServer.MongoMemoryServer();
            _context.next = 3;
            return mongoServer.getConnectionString();

          case 3:
            mongoUri = _context.sent;
            _context.next = 6;
            return _mongoose["default"].connect(mongoUri, opts, function (err) {
              if (err) {
                console.error(err);
              }
            });

          case 6:
            _context.next = 8;
            return (0, _initDatabase["default"])();

          case 8:
            _context.next = 10;
            return (0, _addTenant["default"])(tenant_name);

          case 10:
            _context.next = 12;
            return _Tenant["default"].findOne({
              name: tenant_name
            });

          case 12:
            tenant = _context.sent;
            _context.next = 15;
            return _User["default"].findOne({
              account_name: "".concat(tenant_name, "1")
            });

          case 15:
            user = _context.sent;

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  afterAll(
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _mongoose["default"].disconnect();

          case 2:
            _context2.next = 4;
            return mongoServer.stop();

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  beforeEach(function () {//console.log('outer before each')
  });
  afterEach(function () {//console.log('outer after each')
  });
  describe("upload()", function () {
    beforeAll(
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
    afterAll(
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    var default_req = {
      body: {
        files: []
      }
    };
    var default_res = {
      user: _objectSpread({}, user)
    };
    default_res.user.tenant = _objectSpread({}, tenant);
    it("sample",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5() {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              expect(tenant_name).toBe(tenant.name);

            case 1:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it("\u30D1\u30E9\u30E1\u30FC\u30BF\u4E0D\u6B63: files is empty",
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee6() {
      var req, res_json, res, res_body;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              req = _objectSpread({}, default_req);
              req.body.files = []; //ファイル情報を空にする

              res_json = jest.fn();
              res = _objectSpread({}, default_res, {
                status: jest.fn(function () {
                  return {
                    json: res_json
                  };
                })
              });
              _context6.next = 6;
              return controller.upload(req, res);

            case 6:
              expect(res.status.mock.calls[0][0]).toBe(400); // http response statusは400

              res_body = res_json.mock.calls[0][0]; //1回目の第一引数
              //console.log(res_body)

              expect(res_body.status.success).toBe(false); // status.success = false

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
});