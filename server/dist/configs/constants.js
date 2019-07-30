"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIBRE_OFFICE_PATH = exports.CONVERT_DPI = exports.KAFKA_TOPIC_TIKA_REPLICATION_FACTOR = exports.KAFKA_TOPIC_TIKA_PARTITIONS = exports.KAFKA_TOPIC_TIKA_NAME = exports.KAFKA_CONNECTION_RETRY = exports.KAFKA_CONNECTION_INTERVAL = exports.KAFKA_CONNECTION_TIMEOUT = exports.TIKA_CONNECTION_RETRY = exports.TIKA_CONNECTION_INTERVAL = exports.ELASTIC_INDEXING_TIMEOUT = exports.ELASTIC_CONNECTION_TIMEOUT = exports.ELASTIC_CONNECTION_RETRY = exports.ELASTIC_CONNECTION_INTERVAL = exports.SWIFT_CONNECTION_RETRY = exports.SWIFT_CONNECTION_INTERVAL = exports.MONGO_CONNECTION_RETRY = exports.MONGO_CONNECTION_INTERVAL = exports.PERMISSION_ANALYSIS = exports.PERMISSION_ROLE_MENUS = exports.PERMISSION_ROLE_FILES = exports.PERMISSION_TAGS = exports.PERMISSION_USERS = exports.PERMISSION_FILES = exports.PERMISSION_HOME = exports.PERMISSION_GROUPS = exports.PERMISSION_META_INFOS = exports.PERMISSION_DIR_AUTHORITY = exports.PERMISSION_FILE_AUTHORITY = exports.PERMISSION_AUTHORITY = exports.PERMISSION_DELETE = exports.PERMISSION_RESTORE = exports.PERMISSION_COPY = exports.PERMISSION_MOVE = exports.PERMISSION_MAKE_DIR = exports.PERMISSION_UPLOAD = exports.PERMISSION_CHANGE_META_INFO = exports.PERMISSION_CHANGE_TAG = exports.PERMISSION_CHANGE_NAME = exports.PERMISSION_DOWNLOAD = exports.PERMISSION_VIEW_HISTORY = exports.PERMISSION_VIEW_DETAIL = exports.PERMISSION_VIEW_LIST = exports.ILLIGAL_CHARACTERS = exports.WORKER_LOGGER_CONFIG = exports.LOGGER_CONFIG = exports.MAX_CREATE_PREVIEW_FILE_SIZE = exports.MAX_EMAIL_LENGTH = exports.MAX_STRING_LENGTH = exports.INFOMATION_LIMITS_PER_PAGE = exports.USE_CRYPTO = exports.CRYPTO_PASSWORD = exports.FILE_LIMITS_PER_PAGE = exports.FILE_MAX_UPLOAD_SIZE = void 0;

var _fs = _interopRequireDefault(require("fs"));

// ファイルアップロードの上限
var FILE_MAX_UPLOAD_SIZE = "500mb"; // ファイル一覧 1pageあたりの件数

exports.FILE_MAX_UPLOAD_SIZE = FILE_MAX_UPLOAD_SIZE;
var FILE_LIMITS_PER_PAGE = 30; // ファイル暗号化設定

exports.FILE_LIMITS_PER_PAGE = FILE_LIMITS_PER_PAGE;
var CRYPTO_PASSWORD = "mGjQB5F57C+W";
exports.CRYPTO_PASSWORD = CRYPTO_PASSWORD;
var USE_CRYPTO = false; // お知らせの取得件数

exports.USE_CRYPTO = USE_CRYPTO;
var INFOMATION_LIMITS_PER_PAGE = 5; // label等の文字列最大長さ

exports.INFOMATION_LIMITS_PER_PAGE = INFOMATION_LIMITS_PER_PAGE;
var MAX_STRING_LENGTH = 255; // email addressの制限文字数

exports.MAX_STRING_LENGTH = MAX_STRING_LENGTH;
var MAX_EMAIL_LENGTH = 64; // preview 画像作成の最大ファイルサイズ

exports.MAX_EMAIL_LENGTH = MAX_EMAIL_LENGTH;
var MAX_CREATE_PREVIEW_FILE_SIZE = 32212254720; // loggerの設定

exports.MAX_CREATE_PREVIEW_FILE_SIZE = MAX_CREATE_PREVIEW_FILE_SIZE;
var LOGGER_CONFIG = {
  appenders: {
    file: {
      type: "dateFile",
      filename: "logs/app.log",
      pattern: "-yyyy-MM-dd",
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] %h - %m"
      }
    },
    access: {
      type: "dateFile",
      filename: "logs/access.log",
      pattern: "-yyyy-MM-dd",
      layout: {
        type: 'json'
      }
    },
    info: {
      type: 'logLevelFilter',
      appender: 'access',
      level: 'info',
      maxLevel: 'info'
    },
    error: {
      type: 'logLevelFilter',
      appender: 'file',
      level: 'error'
    }
  },
  categories: {
    "default": {
      appenders: ['info', 'error'],
      level: 'ALL'
    },
    production: {
      appenders: ['info', 'error'],
      level: 'ALL'
    }
  }
};
exports.LOGGER_CONFIG = LOGGER_CONFIG;
var WORKER_LOGGER_CONFIG = {
  appenders: {
    "default": {
      type: "dateFile",
      filename: "logs/worker.log",
      pattern: "-yyyy-MM-dd",
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] %h - %m"
      }
    },
    production: {
      type: "dateFile",
      filename: "logs/worker.log",
      pattern: "-yyyy-MM-dd",
      layout: {
        type: "pattern",
        pattern: "[%d] [%p] %h - %m"
      }
    }
  },
  categories: {
    "default": {
      appenders: ['default'],
      level: 'ALL'
    },
    production: {
      appenders: ['production'],
      level: 'ALL'
    }
  }
}; // 禁止文字一覧
// 使い方: string.match( new RegExp(ILLIGAL_CHARACTERS.join("|")))

exports.WORKER_LOGGER_CONFIG = WORKER_LOGGER_CONFIG;
var ILLIGAL_CHARACTERS = ["\\\\", "\\/", "\\:", "\\*", "\\?", "\\<", "\\>", "\\|"]; // 権限(file)

exports.ILLIGAL_CHARACTERS = ILLIGAL_CHARACTERS;
var PERMISSION_VIEW_LIST = "list";
exports.PERMISSION_VIEW_LIST = PERMISSION_VIEW_LIST;
var PERMISSION_VIEW_DETAIL = "detail";
exports.PERMISSION_VIEW_DETAIL = PERMISSION_VIEW_DETAIL;
var PERMISSION_VIEW_HISTORY = "history";
exports.PERMISSION_VIEW_HISTORY = PERMISSION_VIEW_HISTORY;
var PERMISSION_DOWNLOAD = "download";
exports.PERMISSION_DOWNLOAD = PERMISSION_DOWNLOAD;
var PERMISSION_CHANGE_NAME = "change-name";
exports.PERMISSION_CHANGE_NAME = PERMISSION_CHANGE_NAME;
var PERMISSION_CHANGE_TAG = "change-tag";
exports.PERMISSION_CHANGE_TAG = PERMISSION_CHANGE_TAG;
var PERMISSION_CHANGE_META_INFO = "change-meta-info";
exports.PERMISSION_CHANGE_META_INFO = PERMISSION_CHANGE_META_INFO;
var PERMISSION_UPLOAD = "upload";
exports.PERMISSION_UPLOAD = PERMISSION_UPLOAD;
var PERMISSION_MAKE_DIR = "makedir";
exports.PERMISSION_MAKE_DIR = PERMISSION_MAKE_DIR;
var PERMISSION_MOVE = "move";
exports.PERMISSION_MOVE = PERMISSION_MOVE;
var PERMISSION_COPY = "copy";
exports.PERMISSION_COPY = PERMISSION_COPY;
var PERMISSION_RESTORE = "restore";
exports.PERMISSION_RESTORE = PERMISSION_RESTORE;
var PERMISSION_DELETE = "delete"; //export const PERMISSION_REVERT = "revert";  未使用

exports.PERMISSION_DELETE = PERMISSION_DELETE;
var PERMISSION_AUTHORITY = "authority";
exports.PERMISSION_AUTHORITY = PERMISSION_AUTHORITY;
var PERMISSION_FILE_AUTHORITY = "file-authority"; //ファイル権限変更

exports.PERMISSION_FILE_AUTHORITY = PERMISSION_FILE_AUTHORITY;
var PERMISSION_DIR_AUTHORITY = "dir-authority"; //フォルダ権限変更
// 権限(menu)

exports.PERMISSION_DIR_AUTHORITY = PERMISSION_DIR_AUTHORITY;
var PERMISSION_META_INFOS = "meta_infos";
exports.PERMISSION_META_INFOS = PERMISSION_META_INFOS;
var PERMISSION_GROUPS = "groups";
exports.PERMISSION_GROUPS = PERMISSION_GROUPS;
var PERMISSION_HOME = "home";
exports.PERMISSION_HOME = PERMISSION_HOME;
var PERMISSION_FILES = "files";
exports.PERMISSION_FILES = PERMISSION_FILES;
var PERMISSION_USERS = "users";
exports.PERMISSION_USERS = PERMISSION_USERS;
var PERMISSION_TAGS = "tags";
exports.PERMISSION_TAGS = PERMISSION_TAGS;
var PERMISSION_ROLE_FILES = "role_files";
exports.PERMISSION_ROLE_FILES = PERMISSION_ROLE_FILES;
var PERMISSION_ROLE_MENUS = "role_menus";
exports.PERMISSION_ROLE_MENUS = PERMISSION_ROLE_MENUS;
var PERMISSION_ANALYSIS = "analysis"; // mongoの接続に失敗した場合、リトライに何m秒待つか

exports.PERMISSION_ANALYSIS = PERMISSION_ANALYSIS;
var MONGO_CONNECTION_INTERVAL = 5 * 1000; // mongoの接続を何回試行するか

exports.MONGO_CONNECTION_INTERVAL = MONGO_CONNECTION_INTERVAL;
var MONGO_CONNECTION_RETRY = 20; // swiftの接続に失敗した場合、リトライに何m秒待つか

exports.MONGO_CONNECTION_RETRY = MONGO_CONNECTION_RETRY;
var SWIFT_CONNECTION_INTERVAL = 5 * 1000; // swiftの接続を何回試行するか

exports.SWIFT_CONNECTION_INTERVAL = SWIFT_CONNECTION_INTERVAL;
var SWIFT_CONNECTION_RETRY = 20; // elasticsearchの接続に失敗した場合、リトライに何m秒待つか

exports.SWIFT_CONNECTION_RETRY = SWIFT_CONNECTION_RETRY;
var ELASTIC_CONNECTION_INTERVAL = 5 * 1000; // elasticsearchの接続を何回試行するか

exports.ELASTIC_CONNECTION_INTERVAL = ELASTIC_CONNECTION_INTERVAL;
var ELASTIC_CONNECTION_RETRY = 20; // elasticsearchのタイムアウトm秒

exports.ELASTIC_CONNECTION_RETRY = ELASTIC_CONNECTION_RETRY;
var ELASTIC_CONNECTION_TIMEOUT = 10 * 1000;
exports.ELASTIC_CONNECTION_TIMEOUT = ELASTIC_CONNECTION_TIMEOUT;
var ELASTIC_INDEXING_TIMEOUT = 60 * 1000;
exports.ELASTIC_INDEXING_TIMEOUT = ELASTIC_INDEXING_TIMEOUT;
var TIKA_CONNECTION_INTERVAL = 5 * 1000;
exports.TIKA_CONNECTION_INTERVAL = TIKA_CONNECTION_INTERVAL;
var TIKA_CONNECTION_RETRY = 20; // kafkaのタイムアウトm秒

exports.TIKA_CONNECTION_RETRY = TIKA_CONNECTION_RETRY;
var KAFKA_CONNECTION_TIMEOUT = 10 * 1000;
exports.KAFKA_CONNECTION_TIMEOUT = KAFKA_CONNECTION_TIMEOUT;
var KAFKA_CONNECTION_INTERVAL = 5 * 1000;
exports.KAFKA_CONNECTION_INTERVAL = KAFKA_CONNECTION_INTERVAL;
var KAFKA_CONNECTION_RETRY = 20;
exports.KAFKA_CONNECTION_RETRY = KAFKA_CONNECTION_RETRY;
var KAFKA_TOPIC_TIKA_NAME = 'tika';
exports.KAFKA_TOPIC_TIKA_NAME = KAFKA_TOPIC_TIKA_NAME;
var KAFKA_TOPIC_TIKA_PARTITIONS = 1; //パーティション数

exports.KAFKA_TOPIC_TIKA_PARTITIONS = KAFKA_TOPIC_TIKA_PARTITIONS;
var KAFKA_TOPIC_TIKA_REPLICATION_FACTOR = 3; //レプリケーションファクター数
// pdf->pngファイル変換の解像度

exports.KAFKA_TOPIC_TIKA_REPLICATION_FACTOR = KAFKA_TOPIC_TIKA_REPLICATION_FACTOR;
var CONVERT_DPI = 144; // libreOfficeのパス

exports.CONVERT_DPI = CONVERT_DPI;

var LIBRE_OFFICE_PATH = function LIBRE_OFFICE_PATH() {
  var librePath;

  switch (process.env.NODE_ENV) {
    case "integration":
      librePath = "/usr/bin/soffice";
      break;

    case "production":
      librePath = "/usr/bin/soffice";
      break;

    default:
      librePath = "/usr/bin/soffice";
      break;
  }

  _fs["default"].statSync(librePath); // 存在しなければ例外をスローする


  return librePath;
};

exports.LIBRE_OFFICE_PATH = LIBRE_OFFICE_PATH;