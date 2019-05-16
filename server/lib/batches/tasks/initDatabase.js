import mongoose from "mongoose";

import { SERVER_CONF } from "../../configs/server";

import co from "co";
import { Types } from "mongoose";
import moment from "moment";
import util from "util";

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


const drop_collection = async collection_name => {
  console.log(mongoose.connection.db)
  return new Promise( (resolve, reject) => {
    mongoose.connection.db.dropCollection(collection_name, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

const task = async () => {
  try{
    //2019/05/16 このバッチは動作しない 
    console.log('initDatabase running...')
    // ===============================
    //  all collection drop
    // ===============================
    await drop_collection('files')
    await drop_collection('dirs')
    await drop_collection('tenants')
    await drop_collection('groups')
    await drop_collection('users')
    await drop_collection('tags')
    await drop_collection('meta_infos')
    await drop_collection('display_items')
    await drop_collection('actions')
    await drop_collection('menus')
    await drop_collection('role_files')
    await drop_collection('role_menus')
    await drop_collection('previews')
    await drop_collection('authority_files')
    await drop_collection('authority_menus')
    await drop_collection('notifications')
    await drop_collection('file_meta_infos')
    await drop_collection('download_infos')
    await drop_collection('app_settings')

    // ===============================
    //  files collection
    // ===============================

    // ===============================
    //  dirs collection
    // ===============================

    // ===============================
    //  tenants collection
    // ===============================

    // ===============================
    // groups collection
    // ===============================

    // ===============================
    //  users collection
    // ===============================

    // ===============================
    //  tags collection
    // ===============================

    // ===============================
    //  meta_infos collection
    // ===============================

    // ===============================
    //  display_items collection
    // ===============================

    // ===============================
    //  actions collection
    // ===============================
    var actions = [
      {
        name: "list",
        label: "一覧表示"
      },
      {
        name: "detail",
        label: "詳細表示"
      },
      {
        name: "history",
        label: "履歴情報表示"
      },
      {
        name: "download",
        label: "ダウンロード"
      },
      {
        name: "change-name",
        label: "ファイル名変更"
      },
      {
        name: "change-tag",
        label: "タグ変更"
      },
      {
        name: "change-meta-info",
        label: "メタ情報変更"
      },
      {
        name: "upload",
        label: "アップロード"
      },
      {
        name: "makedir",
        label: "フォルダ作成"
      },
      {
        name: "move",
        label: "移動"
      },
      {
        name: "copy",
        label: "複製"
      },
      {
        name: "restore",
        label: "復元"
      },
      {
        name: "delete",
        label: "削除"
      },
      // {
      //   name: "revert",
      //   label: "ゴミ箱から元に戻す"
      // },
      {
        name: "authority",
        label: "権限変更"
      },
      {
        name: "file-authority",
        label: "ファイル権限変更"
      },
      {
        name: "dir-authority",
        label: "フォルダ権限変更"
      },
    ];

    await Action.insertMany(actions)

    // ===============================
    //  role_files collection
    // ===============================

    // ===============================
    //  menus collection
    // ===============================
    var menus = [
      {
        name: "home",
        label: "ファイル一覧"
      },
      {
        name: "tags",
        label: "タグ管理"
      },
      {
        name: "analysis",
        label: "容量管理"
      },
      {
        name: "users",
        label: "ユーザ管理"
      },
      {
        name: "groups",
        label: "グループ管理"
      },
      {
        name: "role_files",
        label: "ロール管理"
      },
      {
        name: "role_menus",
        label: "ユーザタイプ管理"
      },
      {
        name: "meta_infos",
        label: "メタ情報管理"
      },
    ]
    //db.menus.insert(menus);
    await Menu.insertMany(menus)

    var preview = {
      image: null
    };
    //db.previews.insert(preview);
    await Preview.insertMany(menus)

    // ===============================
    //  ダウンロードファイルの命名規則
    // ===============================

    // ===============================
    //  テナント毎のグローバル設定(app_settings)
    // ===============================


    // ===============================
    // addTenantにてDownloadInfoを作成するためのダミードキュメント。
    // いつか削除する
    //
    var meta_infos = [
      { label: "送信日時", name: "send_date_time", value_type: "Date" },
      { label: "表示ファイル名", name: "display_file_name", value_type: "String" }
    ];
    //db.meta_infos.insert(meta_infos);
    await MetaInfo.insertMany(meta_infos)

    console.log('initDatabase completed.')
  }
  catch (e) {
    console.log(e)
    console.log(util.inspect(e, false, null));
    logger.error(e);
    process.exit();
  }
  finally {
    logger.info("################# init wak tenant end #################");
    process.exit();
  }

}

export default task;

