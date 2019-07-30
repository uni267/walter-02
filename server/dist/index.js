"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _path = _interopRequireDefault(require("path"));

var _log4js = _interopRequireDefault(require("log4js"));

var _events = require("events");

var _logger = _interopRequireDefault(require("./logger"));

var _routes = _interopRequireDefault(require("./routes"));

var _checkServices = require("./checkServices");

var _AppSetting = _interopRequireDefault(require("./models/AppSetting"));

var constants = _interopRequireWildcard(require("./configs/constants"));

var _fs = _interopRequireDefault(require("fs"));

var _crypto = _interopRequireDefault(require("crypto"));

var _superagent = _interopRequireDefault(require("superagent"));

var _util = _interopRequireDefault(require("util"));

var _fileType = _interopRequireDefault(require("file-type"));

var app = (0, _express["default"])();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Cache-Control", "no-store");
  next();
}); // ie11にてファイルサイズが大きい場合、メモリオーバーになる対策

var streamMiddleware = function streamMiddleware(req, res, next) {
  if (req.headers["x-cloud-storage-use-stream"] === "1" && req.method === "POST") {
    var uuid = req.headers["x-file-uuid"];
    var tmpPath = "/tmp/".concat(uuid, ".bin");

    var ws = _fs["default"].createWriteStream(tmpPath, {
      flags: "a"
    });

    ws.on("close", function () {
      var stats = _fs["default"].statSync(tmpPath);

      var fileSize = parseInt(req.headers["x-file-size"]);

      if (stats.size === fileSize) {
        // @todo nextハンドラに渡す際にread streamで渡す方法が判れば...
        var buff = _fs["default"].readFileSync(tmpPath);

        res.blobBody = buff;
        next();
      } else if (stats.size < fileSize) {
        // 残りのチャンクが存在する場合
        res.json(false);
      } else {
        res.status(500).json({
          error: "一時ファイルのサイズが元ファイルよりも大きくなっています"
        });
      }
    });
    req.on("data", function (chunk) {
      ws.write(chunk);
    });
    req.on("end", function () {
      ws.end();
    });
  } else {
    next();
  }
}; // ファイルのblobからmime_typeを取得する


var getMimeType = function getMimeType(buff) {
  var type = (0, _fileType["default"])(buff.slice(0, _fileType["default"].minimumBytes));
  return type === null ? "application/octet-stream" : type.mime;
};

app.use("/api/v1/files/binary", streamMiddleware, function (req, res, next) {
  var mime_type = req.headers["x-file-mime-type"] === "" || req.headers["x-file-mime-type"] === null || req.headers["x-file-mime-type"] === undefined ? getMimeType(res.blobBody) : req.headers["x-file-mime-type"];
  var base64Body = "data:" + mime_type + ";base64," + res.blobBody.toString("base64");

  var checksum = _crypto["default"].createHash("md5").update(new Buffer(base64Body)).digest("hex");

  var fileNameBuffer = new Buffer(req.headers["x-file-name"], "base64");
  var requestBody = {
    files: [{
      name: fileNameBuffer.toString("utf8"),
      mime_type: mime_type,
      size: parseInt(req.headers["x-file-size"]),
      base64: base64Body,
      checksum: checksum
    }],
    dir_id: req.headers["x-dir-id"]
  };

  _superagent["default"].post("http://localhost:3333/api/v1/files").set("X-Auth-Cloud-Storage", req.headers["x-auth-cloud-storage"]).send(requestBody).end(function (err, payload) {
    res.json(payload.body);
  });
});
app.use(_bodyParser["default"].urlencoded({
  limit: constants.FILE_MAX_UPLOAD_SIZE,
  extended: true
}));
app.use(_bodyParser["default"].json({
  limit: constants.FILE_MAX_UPLOAD_SIZE
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, '../../client/build')));
app.use(_log4js["default"].connectLogger(_logger["default"], {
  level: 'info',
  format: function format(req, res, _format) {
    return {
      "remote-addr": _format(":remote-addr"),
      "user_id": res.user ? res.user._id : res.user,
      "method": _format(":method"),
      "url": _format(":url"),
      "referrer": _format(":referrer"),
      "user-agent": _format(":user-agent")
    };
  }
}));
var event = new _events.EventEmitter();
var status = {};
var fullTextSetting; // mongo, swift, elasticsearch, kafka, tikaのヘルスチェックが完了通知を受け取ったらappを起動する

event.on("success",
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(middleware_name) {
    var port, server;
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
              port = (0, _checkServices.getApiPort)();
              server = app.listen(port, function () {
                console.log("start server port: ".concat(port));
              });
              app.use("/", _routes["default"]);
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

    _logger["default"].info("".concat(middleware_name, " connection success"));

    event.emit("success", middleware_name);
  };
};

try {
  (0, _checkServices.checkMongo)(process_checked('mongo'));
  (0, _checkServices.checkSwift)(process_checked('swift'));
  (0, _checkServices.checkElastic)(process_checked('elastic'));
} catch (e) {
  _logger["default"].error(e);

  process.exit();
}