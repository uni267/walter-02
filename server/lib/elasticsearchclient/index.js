import util from "util";
import elasticsearch from "elasticsearch";
import { ELASTICSEARCH_CONF } from "../configs/server";
import co from "co";
import { ELASTIC_INDEXING_TIMEOUT } from "../configs/constants";
import { Swift } from "../storages/Swift";
import request from "superagent";
import { WSAEDQUOT } from "constants";

const mode = process.env.NODE_ENV;

let erasticsearchUrl;
let erasticsearchErrorLevel;

switch (mode) {

  case "integration":
    erasticsearchUrl = `${ELASTICSEARCH_CONF.integration.host}:${ELASTICSEARCH_CONF.integration.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.integration.logLevel;
    break;

  case "production":
    if (! process.env.ELASTIC_HOST_NAME) throw new Error("env.ELASTIC_HOST_NAME is not set");

    erasticsearchUrl = `${ELASTICSEARCH_CONF.production.host}:${ELASTICSEARCH_CONF.production.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.production.logLevel;
    break;

  default:
    erasticsearchUrl = `${ELASTICSEARCH_CONF.development.host}:${ELASTICSEARCH_CONF.development.port}`;
    erasticsearchErrorLevel = ELASTICSEARCH_CONF.development.logLevel;
    break;
  }

const esClient = new elasticsearch.Client({
  host: erasticsearchUrl,
  log: erasticsearchErrorLevel,
  timeout: ELASTIC_INDEXING_TIMEOUT
});

esClient.createIndex = co.wrap(
  function* (tenant_id,files){
    try {
      const bulkBody = [];
      files.forEach(file=>{
        bulkBody.push({
          index:{
            _index: tenant_id,
            _type: "files",
            _id: file._id
          }
        });

        const tags = file.tags.map(t => t._id)

        // // tikaへアクセス
        // const swift = new Swift();
        // const readStream = yield swift.getFile("wakayama", file._id.toString());
  
        let meta = null, text = null
        if(file.buffer){
          const tika_result = getTikaResult(file.buffer)
          meta = tika_result.meta
          text = tika_result.text
        }

        const esFile = {
          _id: file._id,
          name: file.name,
          mime_type: file.mime_type,
          size: file.size,
          is_dir: file.is_dir,
          dir_id: file.dir_id,
          is_display: file.is_display,
          is_star: file.is_star,
          is_trash: file.is_trash,
          is_crypted: file.is_crypted,
          is_deleted: file.is_deleted,
          modified: file.modified,
          preview_id: file.preview_id,
          sort_target: file.sort_target,
          unvisible: file.unvisible,
          tag: tags,
          full_text: meta,
          meta_text: text,
        };

        file.meta_infos.forEach(meta =>{
          esFile[ meta._id.toString() ] = meta.value;
        });

        // タグ検索(2018-01-05:マスタ更新に対応できないのでコメントアウト)
        // file.tags.forEach(tag => {
        //   esFile[tag._id.toString()] = tag.label;
        // });

        esFile.actions = {};

        // 簡易検索でユーザ名で検索するためユーザ名を文字列として保持する(2018-01-05:マスタ更新に対応できないのでコメントアウト)
        // esFile.users = "";

        // 詳細検索ではuser._idで引き当てたい
        file.authorities.forEach((authority,index) => {
          authority.actions.forEach((action, idx) => {
            if(esFile.actions[action._id] === undefined ) esFile.actions[action._id] = [];
            esFile.actions[action._id].push(authority.users._id);
          });
          // esFile.users += (esFile.users==="" ? "": " ") + authority.users.name;
        });
        bulkBody.push({
          file: esFile
        });

      });

      const result = yield esClient.bulk({ refresh:"true", body:bulkBody });
      if(result.errors) throw result.items[0].index;

      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }

  }
);

export default esClient;

export const getTikaResult = (buffer) => {
  co(function*() {

    const tikaUrl = "http://tika:9998";
    //const tikaUrl = "http://localhost:9998";
    const meta = yield request.put(tikaUrl + "/meta")
      .set("Accept", "application/json")
      .send(buffer);
    const text = yield request.put(tikaUrl + "/tika").send(buffer);        
    return {meta, text}
  });
}
