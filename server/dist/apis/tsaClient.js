"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.API = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _axios = _interopRequireDefault(require("axios"));

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _server = require("../configs/server");

var mode = process.env.NODE_ENV;
var baseURL;

switch (mode) {
  case "integration":
    baseURL = "".concat(_server.TIMESTAMP_API_CONF.integration.url, ":").concat(_server.TIMESTAMP_API_CONF.integration.port, "/").concat(_server.TIMESTAMP_API_CONF.integration.apiVersion);
    break;

  case "production":
    if (!process.env.TIMESTAMP_API_BASE_URL) throw new Error("env.TIMESTAMP_API_BASE_URL is not set");
    1;
    baseURL = "".concat(_server.TIMESTAMP_API_CONF.production.url, ":").concat(_server.TIMESTAMP_API_CONF.production.port, "/").concat(_server.TIMESTAMP_API_CONF.production.apiVersion);
    break;

  default:
    baseURL = "".concat(_server.TIMESTAMP_API_CONF.development.url, ":").concat(_server.TIMESTAMP_API_CONF.development.port, "/").concat(_server.TIMESTAMP_API_CONF.development.apiVersion);
    break;
}

var API =
/*#__PURE__*/
function () {
  function API() {
    var tsaUser = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var tsaPass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck2["default"])(this, API);
    this.client = _axios["default"].create({
      baseURL: baseURL,
      timeout: 10000,
      auth: {
        username: tsaUser,
        password: tsaPass
      }
    });
  }

  (0, _createClass2["default"])(API, [{
    key: "grantToken",
    value: function grantToken() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/grant/tst/binary", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "grantPades",
    value: function grantPades() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/grant/pades/binary", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "grantaddLTV",
    value: function grantaddLTV() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/grant/addLTV/binary", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "grantEst",
    value: function grantEst() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/grant/ES-T/binary", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "verifyToken",
    value: function verifyToken() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      var token = arguments.length > 2 ? arguments[2] : undefined;
      return this.client.post("/verify/tst/binary", {
        requestId: requestId,
        file: file,
        token: token
      });
    }
  }, {
    key: "verifyPades",
    value: function verifyPades() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/verify/pades/binary", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "inspect",
    value: function inspect() {
      var requestId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var file = arguments.length > 1 ? arguments[1] : undefined;
      return this.client.post("/inspect", {
        requestId: requestId,
        file: file
      });
    }
  }, {
    key: "_getCurrentTime",
    value: function _getCurrentTime() {
      return (0, _moment["default"])().format();
    }
  }, {
    key: "_get10YearsAfter",
    value: function _get10YearsAfter() {
      return (0, _moment["default"])().add(_moment["default"].duration(10, 'months')).format();
    }
  }]);
  return API;
}();

exports.API = API;
var _default = API;
exports["default"] = _default;