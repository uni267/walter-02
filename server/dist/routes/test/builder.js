"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authData = exports.initdbPromise = exports.mongoUrl = exports.app = void 0;

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var _server = require("../../configs/server");

// express初期化
var app = (0, _express["default"])();
exports.app = app;
app.use(_bodyParser["default"].json({
  limit: "100MB"
})); // mongodbのurl(mongodb://xxxx)

var url = _server.SERVER_CONF.development.url;
var db_name = _server.SERVER_CONF.development.db_name;
var mongoUrl = "".concat(url, "/").concat(db_name); // mongoをinitするコマンド

exports.mongoUrl = mongoUrl;

var batch_path = _path["default"].join(__dirname, "../../../jobs/loadTestData.js");

var db_host = _server.SERVER_CONF.development.db_host;
var command = "/usr/local/bin/mongo ".concat(db_host, "/").concat(db_name, " --quiet ").concat(batch_path); // mochaのbeforeはPromiseを返却する必要があるので

var initdbPromise = new Promise(function (resolve, reject) {
  (0, _child_process.exec)(command, function (err, stdout, stderr) {
    if (err) return reject({
      err: err,
      stderr: stderr
    });
    return resolve();
  });
}).then(function (res) {
  // elasticsearchのmapping
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)("npm run init-elasticsearch", function (err, stdout, stderr) {
      if (err) return reject({
        err: err,
        stderr: stderr
      });
      return resolve();
    });
  });
}); // とりあえず

exports.initdbPromise = initdbPromise;
var authData = {
  account_name: "taro",
  name: "taro",
  email: "taro",
  password: "test",
  tenant_name: "test"
};
exports.authData = authData;