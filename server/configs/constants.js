// ファイル一覧 1pageあたりの件数
export const FILE_LIMITS_PER_PAGE = 30;

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