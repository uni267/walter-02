"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeConsumer = exports.getConsumer = exports.produce = exports.createTopics = exports.getKafkaClient = void 0;

var _server = require("../configs/server");

var _constants = require("../configs/constants");

var _superagent = _interopRequireDefault(require("superagent"));

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

var mode = process.env.NODE_ENV;
var kafkaUrl;

switch (mode) {
  case "integration":
    kafkaUrl = "".concat(_server.KAFKA_CONF.integration.host, ":").concat(_server.KAFKA_CONF.integration.port);
    break;

  case "production":
    if (!process.env.KAFKA_HOST_NAME) throw new Error("env.KAFKA_HOST_NAME is not set");
    kafkaUrl = "".concat(_server.KAFKA_CONF.production.host, ":").concat(_server.KAFKA_CONF.production.port);
    break;

  default:
    kafkaUrl = "".concat(_server.KAFKA_CONF.development.host, ":").concat(_server.KAFKA_CONF.development.port);
    break;
}

var getKafkaClient = function getKafkaClient(config) {
  return new _kafkaNode["default"].KafkaClient({
    kafkaHost: config ? config.kafkaHost : kafkaUrl,
    sessionTimeout: _constants.KAFKA_CONNECTION_TIMEOUT //connectTimeout: config ? config.connectTimeout : KAFKA_CONNECTION_TIMEOUT,  //←なぜか動かない
    //requestTimeout: config ? config.connectTimeout : KAFKA_CONNECTION_TIMEOUT,

  });
};

exports.getKafkaClient = getKafkaClient;

var createTopics = function createTopics(topicsToCreate) {
  var client = getKafkaClient();
  var admin = new _kafkaNode["default"].Admin(client);
  return new Promise(function (resolve, reject) {
    admin.createTopics(topicsToCreate, function (error, result) {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}; // kafkaホストにキュー送信


exports.createTopics = createTopics;

var produce = function produce(payloads, config) {
  // configには設定しない（テスト用）
  return new Promise(function (resolve, reject) {
    var client = getKafkaClient(config);
    var kafkaProducer = new _kafkaNode["default"].Producer(client, {
      // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 2
    });
    kafkaProducer.on('ready', function () {
      //console.log('producer is ready')
      kafkaProducer.send(payloads, function (err, data) {
        if (err) {
          //console.log('producer senderror:' + err)
          reject(err);
        } else {
          //console.log('producer success:' + data)
          resolve(data);
        }
      });
    });
    kafkaProducer.on('error', function (err) {
      console.log('producer error:' + err);
      reject(err);
    }); // kafkaProducer.on('uncaughtException', err => {
    //   console.log('producer uncaughtException:' + err)
    //   reject(err)
    // });
  });
};

exports.produce = produce;

var getConsumer = function getConsumer(payloads, config) {
  // configには設定しない（テスト用）
  var client = getKafkaClient(config);
  var consumer = new _kafkaNode["default"].Consumer(client, payloads, {
    autoCommit: false
  });
  return consumer;
};

exports.getConsumer = getConsumer;

var closeConsumer = function closeConsumer(consumer) {
  return new Promise(function (resolve, reject) {
    consumer.close(true, function () {
      return resolve();
    });
  });
};

exports.closeConsumer = closeConsumer;