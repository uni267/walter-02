import co from "co";
import { Types } from "mongoose";
import moment from "moment";
import util from "util";

import esClient from "../../lib/elasticsearchclient";

// logger
import logger from "../../lib/logger";

// models
import Tenant from "../../lib/models/Tenant";
import DisplayItem from "../../lib/models/DisplayItem";
import MetaInfo from "../../lib/models/MetaInfo";
import Action from "../../lib/models/Action";

const task = () => {
  co(function* () {
    try {
      const tenant_id = (yield Tenant.findOne({"name":"test"}))._id.toString();
      const type = "files";

      const settings = {
        "analysis": {
          "tokenizer": {
            "kuromoji_search": {
              "type": "kuromoji_tokenizer",
              "mode": "search",
              "discard_punctuation": "false"
            }
          },
          "analyzer":{
            "default": {
              "tokenizer": "kuromoji_search"
            }
          }
        }
      };

      const file_prperties={
        _id: { type:"text", },
        name: { type:"text", fielddata:true },
        mime_type: { type:"text", index: false },
        size: { type:"long", index: false },
        is_dir: { type:"boolean" },
        dir_id: { type:"keyword" },
        is_display: { type:"boolean" },
        is_star: { type:"boolean" },
        is_crypted: { type:"boolean", index: false },
        is_deleted: { type:"boolean" },
        modified: { type:"date", index: false },
        preview_id: { type:"text", index: false },
        authorities: { type:"nested",  },
        dirs: { type:"nested" },
        sort_target: { type:"text", index: false },
      };

      // meta_infoのマッピング
      const meta_infos = yield MetaInfo.find({
        tenant_id: Types.ObjectId( tenant_id )
      });

      meta_infos.forEach((item,index)=>{
        file_prperties[item._id] = {
          type: item.value_type === "Date" ? "date" : "text",
          "fields": { // sort用のフィールドを持つ
            "raw": {
              "type": "keyword"
            }
          }

        };
      });

      const actions = yield Action.find();
      actions.forEach((item,index)=>{
        file_prperties[item._id] = {
          "type":  "keyword"
        };
      });

      const mappings = {
        index: tenant_id,
        type: type,
        body:{
          properties: {
            file:{
              properties: file_prperties
            }
          }
        }
      };

    const isExists = yield esClient.indices.exists( { index: tenant_id } );

    if( isExists ){
      console.log(`delete index: ${tenant_id}`);
      yield esClient.indices.delete({ index: tenant_id });
    }
    console.log(`create index:${tenant_id}`);

    yield esClient.indices.create(
      { index: tenant_id ,
        body: {
          settings
        }
      }
    );
    console.log("put mapping");
    yield esClient.indices.putMapping(mappings);
    console.log("done!");

    } catch (error) {
      console.log(error);
    } finally {
      process.exit();

    }

  });
};

export default task;