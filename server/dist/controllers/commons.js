"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorParser = void 0;

var errorParser = function errorParser(error) {
  return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
};

exports.errorParser = errorParser;