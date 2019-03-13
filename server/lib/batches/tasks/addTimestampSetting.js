import util from "util";

// logger
import logger from "../../logger";

// models
import Tenant from "../../models/Tenant";
import Action from "../../models/Action";
import AppSetting from "../../models/AppSetting";
import MetaInfo from "../../models/MetaInfo";

const task = async () => {
  try{
    console.log('addTenantバッチにより追加されたテナントに対し、タイムスタンプ機能を追加します。')

    if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
    //テナント名をfindしてなければアウト
    const tenantName = process.argv[3]
    const tenant = await Tenant.findOne({ name: tenantName})
    if(!tenant) throw new Error("存在しないテナントです");
    console.log(`テナント ${tenant.name}(${tenant._id}) の設定を更新します。`)
    console.log('start')

    const description = 'タイムスタンプサービスの利用を許可する'
    let appSetting = await AppSetting.findOne({
      tenant_id: tenant._id,
      name: AppSetting.TIMESTAMP_PERMISSION,
      description,
    })

    appSetting = appSetting || new AppSetting({
      tenant_id: tenant._id,
      name: AppSetting.TIMESTAMP_PERMISSION,
      description,
      enable: false,
      default_value: false
    })

    if (!appSetting.enable) {
      appSetting.enable = true
      await appSetting.save()
    }

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
  }
  catch (e) {
    console.log(e)
    console.log(util.inspect(e, false, null));
    logger.error(e);
    process.exit();
  }
  finally {
    console.log('end')
    logger.info("################# add timestamp setting end #################");
    process.exit();
  }

}

export default task;
