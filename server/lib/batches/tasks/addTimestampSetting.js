import util from "util";

import esClient from "../../elasticsearchclient";

// logger
import logger from "../../logger";

// models
import Tenant from "../../models/Tenant";
import Action from "../../models/Action";
import AppSetting from "../../models/AppSetting";
import MetaInfo from "../../models/MetaInfo";

const task = async () => {
  try{
    console.log('追加済のテナントに対し、タイムスタンプ機能を追加します。')
    console.log('-------- Start --------')

    if (!process.argv[3]) throw "引数にテナント名を指定する必要があります。"
    if (!process.argv[4]) throw "サイバーリンクスTSA認証局のユーザIDを指定してください。"
    if (!process.argv[5]) throw "サイバーリンクスTSA認証局のユーザPWを指定してください。"

    const tenantName = process.argv[3]
    const tenant = await Tenant.findOne({ name: tenantName})
    if (!tenant) throw "存在しないテナントです。"

    const tsaUser = process.argv[4]
    const tsaPass = process.argv[5]

    console.log(`テナント ${tenant.name}(${tenant._id}) の設定を更新します。。。`)

    const mapping = await esClient.indices.getMapping({ index: [tenant._id] })
    const props = mapping[tenant._id.toString()].mappings.files.properties.file.properties
    const newFileProps = {
      properties: {
        file: {
          properties: {
            ...props,
            tstStatus: { "type": "keyword" },
            tstExpirationDate: { "type": "date" },
          }
        }
      }
    }
    await esClient.indices.putMapping({index: [tenant._id], type: "files", body:JSON.stringify(newFileProps)});

    // タイムスタンプ関連のアクションを追加（全テナント共有）
    const appSetting = await AppSetting.findOne({ tenant_id: tenant._id, name: AppSetting.TIMESTAMP_PERMISSION })
    if (!appSetting) {
      await AppSetting.create({
          tenant_id: tenant._id,
          name: AppSetting.TIMESTAMP_PERMISSION,
          description: 'タイムスタンプサービスの利用を許可する。',
          enable: true,
      });
    }
    else {
      await appSetting.update({
        $set: {
          enable: true
        }
      })
    }

    await tenant.update({
      $set: {
        tsaAuth: {
          user: tsaUser,
          pass: tsaPass,
        }
      }
    })

    // タイムスタンプ関連のアクションを追加（全テナント共有）
    if(!(await Action.findOne({ name: "add-timestamp" }))){
      await Action.insertMany([
        {
          "name" : "add-timestamp",
          "label" : "タイムスタンプ発行"
        },
      ]);
    }

    if(!(await Action.findOne({ name: "verify-timestamp" }))){
      await Action.insertMany([
        {
          "name" : "verify-timestamp",
          "label" : "タイムスタンプ検証"
        },
      ]);
    }

    if(!(await Action.findOne({ name: "auto-timestamp" }))){
      await Action.insertMany([
        {
          "name" : "auto-timestamp",
          "label" : "タイムスタンプ自動発行"
        },
      ]);
    }

    if(!(await Action.findOne({ name: "auto-timestamp" }))){
      await Action.insertMany([
        {
          "name" : "auto-timestamp",
          "label" : "タイムスタンプ自動発行"
        },
      ]);
    }

    // タイムスタンプ関連のメタ情報を追加（全テナント共有）
    if(!(await MetaInfo.findOne({ name: "timestamp" }))){
      await MetaInfo.insertMany([
        {
          "name" : "timestamp",
          "label" : "タイムスタンプ",
          "value_type" : "Array",
        },
      ]);
    }

    if(!(await MetaInfo.findOne({ name: "auto_grant_timestamp" }))){
      await MetaInfo.insertMany([
        {
          "name" : "auto_grant_timestamp",
          "label" : "自動タイムスタンプ",
          "value_type" : "Boolean",
        },
      ]);
    }

    // タイムスタンプをファイル一覧のフィルタリング項目に追加

  }
  catch (e) {
    console.log(e)
    console.log(util.inspect(e, false, null));
    logger.error(e);
    process.exit();
  }
  finally {
    console.log('-------- Finish --------')
    logger.info("################# add timestamp setting end #################");
    process.exit();
  }

}

export default task;
