// mongoの接続先情報
export const SERVER_CONF = {
  development: {
    url: "mongodb://192.168.56.10",
    db_name: "walter",
    port: 3333
  },
  production: {
    url: "mongodb://192.168.56.10",
    db_name: "walter",
    port: 3333
  }
};

// パスワードhash用の秘密鍵
// @todo テナント毎に分ける？
export const SECURITY_CONF = {
  development: {
    secretKey: "secretKey"
  }
};
