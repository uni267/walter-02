// ファイル一覧 1pageあたりの件数
export const FILE_LIMITS_PER_PAGE = 30;
export const SWIFT_CONTAINER_NAME = "walter";

// ファイル暗号化設定
export const CRYPTO_PASSWORD = "mGjQB5F57C+W";
export const USE_CRYPTO = true;

// loggerの設定
export const LOGGER_CONFIG = {
  appenders: {
    default: {
      type:     "dateFile",
      filename: "logs/app.log",
      pattern:  "-yyyy-MM-dd",
      layout:{
        type: "pattern",
        pattern: "[%d] [%p] %h - %m"
      }
    },
    production: {
      type:     "dateFile",
      filename: "logs/app.log",
      pattern:  "-yyyy-MM-dd",
      layout:{
        type: "pattern",
        pattern: "[%d] [%p] %h - %m"
      }
    }
  },
  categories:{
    default: {
      appenders:['default'],
      level: 'ALL',
    },
    production: {
      appenders:['production'],
      level: 'error',
    }
  },
};

// 権限
export const PERMISSION_VIEW_LIST = "read"; // 一覧と詳細の権限を別にする場合は分ける
export const PERMISSION_VIEW_DETAIL = "read";
export const PERMISSION_VIEW_HISTORY = "";
export const PERMISSION_DOWNLOAD = "";
export const PERMISSION_CHANGE_NAME = "";
export const PERMISSION_CHANGE_TAG = "";
export const PERMISSION_CHANGE_META_INFO = "";
export const PERMISSION_UPLOAD = "";
export const PERMISSION_MAKE_DIR = "";
export const PERMISSION_MOVE = "";
export const PERMISSION_COPY = "";
export const PERMISSION_RESTORE = "";
export const PERMISSION_DELETE = "delete";
export const PERMISSION_REVERT = "";
