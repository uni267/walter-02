"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.binaryParser = void 0;

// arrayBuffer形式のレスポンスをパースする
var binaryParser = function binaryParser(res, callback) {
  res.setEncoding("binary");
  res.data = "";
  res.on("data", function (chunk) {
    res.data += chunk;
  });
  res.on("end", function () {
    callback(null, new Buffer(res.data, "binary"));
  });
};

exports.binaryParser = binaryParser;