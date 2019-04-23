import { TIKA_CONF } from "../configs/server";
import request from "superagent";

const mode = process.env.NODE_ENV;

let tikaUrl;

switch (mode) {

  case "integration":
    tikaUrl = `${TIKA_CONF.integration.host}:${TIKA_CONF.integration.port}`;
    break;

  case "production":
    if (! process.env.TIKA_HOST_NAME) throw new Error("env.TIKA_HOST_NAME is not set");

    tikaUrl = `${TIKA_CONF.production.host}:${TIKA_CONF.production.port}`;
    break;

  default:
    tikaUrl = `${TIKA_CONF.development.host}:${TIKA_CONF.development.port}`;
    break;
}

const tikaClient = request

//メタ情報の取得
tikaClient.getMetaInfo = async buffer => {
  return await request.put(tikaUrl + "/meta")
    .set("Accept", "application/json")
    .send(buffer);
}
//テキスト情報の取得
tikaClient.getTextInfo = async buffer => {
    return await request.put(tikaUrl + "/tika").send(buffer);
}

tikaClient.checkConnection = async () => {
  return await request.get(tikaUrl + "/tika")
}


export default tikaClient;