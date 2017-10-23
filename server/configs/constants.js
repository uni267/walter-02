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
export const FILE_READ = "read";
export const FILE_WRITE = "write";
export const FILE_DELETE = "delete";

