// mongoの接続先情報
export const SERVER_CONF = {
  development: {
    url: "mongodb://192.168.56.10",  // virtualbox
    db_name: "walter",
    port: 3333
  },
  integration: {
    url: "mongodb://172.16.55.74",  // 社内docker
    db_name: "walter",
    port: 3333
  },
  production: {
    url: "mongodb://192.168.56.10",  // とりあえず
    db_name: "walter",
    port: 3333
  }
};

// パスワードhash用の秘密鍵
// @todo テナント毎に分ける？
export const SECURITY_CONF = {
  development: {
    secretKey: "secretKey"
  },
  migration: {
    secretKey: "secretKey"
  }
};
