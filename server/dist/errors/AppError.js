"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermisstionDeniedException = exports.RecordNotFoundException = exports.ValidationError = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var AppError =
/*#__PURE__*/
function (_Error) {
  (0, _inherits2["default"])(AppError, _Error);

  function AppError(message, body) {
    var _this;

    (0, _classCallCheck2["default"])(this, AppError);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AppError).call(this));
    _this.message = message;
    _this.name = _this.constructor.name;
    _this.body = body === undefined ? null : body;

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace((0, _assertThisInitialized2["default"])(_this), _this.constructor);
    } else {
      _this.stack = new Error(message).stack;
    }

    return _this;
  }

  return AppError;
}((0, _wrapNativeSuper2["default"])(Error));

var ValidationError =
/*#__PURE__*/
function (_AppError) {
  (0, _inherits2["default"])(ValidationError, _AppError);

  function ValidationError(message, body) {
    var _this2;

    (0, _classCallCheck2["default"])(this, ValidationError);
    _this2 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ValidationError).call(this, message, body));
    _this2.name = "ValidationError";
    return _this2;
  }

  return ValidationError;
}(AppError);

exports.ValidationError = ValidationError;

var RecordNotFoundException =
/*#__PURE__*/
function (_AppError2) {
  (0, _inherits2["default"])(RecordNotFoundException, _AppError2);

  function RecordNotFoundException(message, body) {
    var _this3;

    (0, _classCallCheck2["default"])(this, RecordNotFoundException);
    _this3 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(RecordNotFoundException).call(this, message, body));
    _this3.name = "RecordNotFoundException";
    return _this3;
  }

  return RecordNotFoundException;
}(AppError);

exports.RecordNotFoundException = RecordNotFoundException;

var PermisstionDeniedException =
/*#__PURE__*/
function (_AppError3) {
  (0, _inherits2["default"])(PermisstionDeniedException, _AppError3);

  function PermisstionDeniedException(message, body) {
    var _this4;

    (0, _classCallCheck2["default"])(this, PermisstionDeniedException);
    _this4 = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(PermisstionDeniedException).call(this, message, body));
    _this4.name = "PermisstionDeniedException";
    return _this4;
  }

  return PermisstionDeniedException;
}(AppError);

exports.PermisstionDeniedException = PermisstionDeniedException;