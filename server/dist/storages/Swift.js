"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Swift = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _fs = _interopRequireDefault(require("fs"));

var _pkgcloud = _interopRequireDefault(require("pkgcloud"));

var _crypto = _interopRequireDefault(require("crypto"));

var _stream = _interopRequireDefault(require("stream"));

var _server = require("../configs/server");

var constants = _interopRequireWildcard(require("../configs/constants"));

var Swift =
/*#__PURE__*/
function () {
  function Swift(params) {
    (0, _classCallCheck2["default"])(this, Swift);
    var mode = process.env.NODE_ENV;
    var config;

    switch (mode) {
      case "integration":
        config = _server.STORAGE_CONF.integration;
        break;

      case "production":
        if (!process.env.SWIFT_HOST_NAME) throw new Error("env.SWIFT_HOST_NAME is not set");
        config = _server.STORAGE_CONF.production;
        break;

      default:
        config = _server.STORAGE_CONF.development;
        break;
    }

    this.client = _pkgcloud["default"].storage.createClient(config);
  }

  (0, _createClass2["default"])(Swift, [{
    key: "getContainers",
    value: function getContainers() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.client.getContainers(function (err, containers) {
          if (err) return reject(err);
          return resolve(containers);
        });
      });
    }
  }, {
    key: "getFiles",
    value: function getFiles(container_name) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.client.getFiles(container_name, function (err, files) {
          if (err) reject(err);
          resolve(files);
        });
      });
    }
  }, {
    key: "getFile",
    value: function getFile(container_name, file_name) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.client.getFile(container_name, file_name, function (err, file) {
          if (err) reject(err);
          resolve(file);
        });
      });
    }
    /*
      downloadFile(container_name, file) {
        return new Promise( (resolve, reject) => {
          const stream = fs.createWriteStream("/tmp/stream.tmp");
    
          if(file.is_crypted){
            const decipher = crypto.createDecipher("aes-256-cbc", constants.CRYPTO_PASSWORD);
            this.client.download({
              container: container_name,
              remote: file._id.toString()
            }, (err, result) => {
              if (err) reject(err);
            }).pipe(decipher).pipe(stream).on("finish", () => resolve(stream) );
          }else{
            this.client.download({
              container: container_name,
              remote: file._id.toString()
            }, (err, result) => {
              if (err) reject(err);
            }).pipe(stream).on("finish", () => resolve(stream) );
          }
        }).then( writeStream => {
          return new Promise( (resolve, reject) => {
            resolve(fs.createReadStream(writeStream.path));
          });
        });
      }
    */

  }, {
    key: "downloadFile",
    value: function downloadFile(container_name, file) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var decipher = _crypto["default"].createDecipher("aes-256-cbc", constants.CRYPTO_PASSWORD);

        var stream = _this4.client.download({
          container: container_name,
          remote: file._id.toString()
        });

        file.is_cripted ? resolve(stream.pipe(decipher)) : resolve(stream);
      });
    }
  }, {
    key: "upload",
    value: function upload(container_name, srcFilePath, dstFileName) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var readStream = new _stream["default"].PassThrough();
        readStream.end(srcFilePath);

        var writeStream = _this5.client.upload({
          container: container_name,
          remote: dstFileName
        });

        writeStream.on("error", function (err) {
          return reject(err);
        });
        writeStream.on("success", function (file) {
          return resolve(file);
        });

        if (constants.USE_CRYPTO) {
          var cipher = _crypto["default"].createCipher("aes-256-cbc", constants.CRYPTO_PASSWORD);

          readStream.pipe(cipher).pipe(writeStream);
        } else {
          readStream.pipe(writeStream);
        }
      });
    }
  }, {
    key: "remove",
    value: function remove(container_name, file) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.client.removeFile(container_name, file._id.toString(), function (err, result) {
          if (err) reject(err);
          resolve(result);
        });
      });
    }
  }, {
    key: "exportFile",
    value: function exportFile(container_name, file, exportDir) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        var stream = _fs["default"].createWriteStream(exportDir);

        var downloadFile = {};

        if (file.is_crypted) {
          var decipher = _crypto["default"].createDecipher("aes-256-cbc", constants.CRYPTO_PASSWORD);

          _this7.client.download({
            container: container_name,
            remote: file._id.toString()
          }, function (err, result) {
            if (err) reject(err);
            downloadFile = result;
          }).pipe(decipher).pipe(stream).on("finish", function () {
            return resolve(downloadFile);
          });
        } else {
          _this7.client.download({
            container: container_name,
            remote: file._id.toString()
          }, function (err, result) {
            if (err) reject(err);
            downloadFile = result;
          }).pipe(stream).on("finish", function () {
            return resolve(downloadFile);
          });
        }
      });
    }
  }]);
  return Swift;
}();

exports.Swift = Swift;