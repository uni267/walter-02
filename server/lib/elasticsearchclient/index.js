import util from "util";
import elasticsearch from "elasticsearch";
import { ELASTICSEARCH_CONF } from "../configs/server";
import co from "co";
import { ELASTIC_INDEXING_TIMEOUT } from "../configs/constants";
import AppSetting from "../models/AppSetting";

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

esClient.createIndex = async (tenant_id, files) =>{
  try {
    const bulkBody = [];
    const appSetting = await AppSetting.findOne({ tenant_id, name: AppSetting.TIMESTAMP_PERMISSION })
    const timestampOptionEnabled = !!appSetting && !!appSetting.enable

    files.forEach(file=>{
      bulkBody.push({
        index:{
          _index: tenant_id,
          _type: "files",
          _id: file._id
        }
      });

      const tags = file.tags.map(t => t._id)

      // let meta = null, text = null
      // if(file.buffer){
      //   const tika_result = getTikaResult(file.buffer)
      //   meta = tika_result.meta
      //   text = tika_result.text
      // }

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
        full_text: file.full_text,
        meta_text: file.meta_text,
      };

      file.meta_infos.filter(m => m.name !== "timestamp").forEach(meta =>{
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
          if(authority.users !== undefined && authority.users !== null) {
            esFile.actions[action._id].push(authority.users._id);
          }
          if(authority.groups !== undefined && authority.groups !== null) {
            esFile.actions[action._id].push(authority.groups._id);
          }
        });
        // esFile.users += (esFile.users==="" ? "": " ") + authority.users.name;
      });

      if (timestampOptionEnabled) {
        const tsMetaInfo = file.meta_infos.find(m => m.name === "timestamp")
        if (!!tsMetaInfo && tsMetaInfo.value.length > 0) {
          const tst = tsMetaInfo.value[tsMetaInfo.value.length-1]
          esFile.tstStatus = tst.status
          esFile.tstExpirationDate = tst.expirationDate
        }
      }

      bulkBody.push({
        file: esFile
      });
    });

    const result = await esClient.bulk({ refresh:"true", body:bulkBody });
    if(result.errors) throw result.items[0].index;

    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject(e);
  }

}
esClient.syncDocument = async (tenant_id,file) =>{
  const org_file = await esClient.getFile(tenant_id.toString(), file._id )
  file.full_text = org_file.full_text
  file.meta_text = org_file.meta_text
  await esClient.createIndex(tenant_id,[file])
}



// esClient.updateName = async (tenant_id, file_id, name) => {
//   await esClient.updateByQuery({ 
//     index: tenant_id,
//     type: "files",
//     body: { 
//       "query": {
//         "bool": {
//           "must": [
//             {"term": {
//               "_id": file_id
//             }}
//           ]
//         }
//       },
//       "script": "ctx._source.file.name = " + name.replace(/\'/g, '\\\'') + ";"
//     }
//   })
// }
//全文検索用フィールドの更新
esClient.updateTextContents = async (tenant_id, file_id, meta_text, full_text) => {

  const script_helper = str => {
    const converted = str.replace(/　/g, ' ') //全角スペース→半角スペース
      .replace(/\n|\r\n|\r/g, ' ') //改行コード→半角スペース
      .replace(/\'/g, '\\\'')  //シングルクオーテーションのエスケープ
      .replace(/ {2,}/g, ' ') //連続するスペース→単一半角スペース
    return ( converted !== null ? `'${converted}'` : "null" )
  }

  await esClient.updateByQuery({ 
    index: tenant_id,
    type: "files",
    body: { 
      "query": {
        "bool": {
          "must": [
            {"term": {
              "_id": file_id
            }}
          ]
        }
      },
      "script": "ctx._source.file.full_text = " + script_helper(full_text) + ";"
              + "ctx._source.file.meta_text = " + script_helper(meta_text) +  ";" 
    }
  })
}

// file_idよりfile情報を取得
esClient.getFile = async (tenant_id, file_id) => {
  const result = await esClient.search({
    index: tenant_id,
    type: "files",
    body:
    {
      "query": {
        "term": {
            "_id": file_id
        }
      }
    }
  })
  return result.hits.hits[0]._source.file
}


export default esClient;
