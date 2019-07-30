"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

_mongoose["default"].Promise = global.Promise;
var TestSchema = (0, _mongoose.Schema)({
  name: String,
  age: Number
});

TestSchema.statics.test_method = function () {
  return "test_method is called";
}; // TestSchema.statics = {
//   test_method: () => {
//     return "test_method is called";
//   }
// };


var Test = _mongoose["default"].model("tests", TestSchema, "tests");

var _default = Test;
exports["default"] = _default;