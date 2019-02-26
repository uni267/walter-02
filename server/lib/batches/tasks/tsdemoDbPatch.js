import co from "co";
import { Types } from "mongoose";
import moment from "moment";
import util from "util";
import * as _ from "lodash";

// logger
import logger from "../../logger";

// models
import Tenant from "../../models/Tenant";
import Dir from "../../models/Dir";
import File from "../../models/File";
import Group from "../../models/Group";
import User from "../../models/User";
import Action from "../../models/Action";
import Menu from "../../models/Menu";
import RoleFile from "../../models/RoleFile";
import RoleMenu from "../../models/RoleMenu";
import AuthorityMenu from "../../models/AuthorityMenu";
import AuthorityFile from "../../models/AuthorityFile";
import Preview from "../../models/Preview";
import AppSetting from "../../models/AppSetting";
import DownloadInfo from "../../models/DownloadInfo";

import Tag from "../../models/Tag";
import DisplayItem from "../../models/DisplayItem";
import MetaInfo from "../../models/MetaInfo";

const task = async () => {
  try{

    console.log('addTenantバッチにより追加されたテナントに対し、カスタマイズします。')

    if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
    //テナント名をfindしてなければアウト
    const tenantName = process.argv[3]
    const tenant = await Tenant.findOne({ name: tenantName})
    if(!tenant) throw new Error("存在しないテナントです");
    console.log(`テナント ${tenant.name}(${tenant._id}) の設定を更新します。`)
    console.log('start')

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

  }
  catch (e) {
    console.log(e)
    console.log(util.inspect(e, false, null));
    logger.error(e);
    process.exit();
  }
  finally {
    console.log('end')
    logger.info("################# init wak tenant end #################");
    process.exit();
  }

}

export default task;
