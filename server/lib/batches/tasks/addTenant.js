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

const task = async () => {
  try{
    console.log('start')

    if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
    const tenantName = process.argv[3]
    const _tenant = await Tenant.findOne({ name: tenantName})
    if(_tenant) throw new Error("すでに存在しているテナントです");

    const now = new Date()
    const root_files = [
      {
        name: "Top",
        modified: now,
        is_dir: true,
        //dir_id: 0.0,
        is_display: false,
        authority_files: []
      },
      {
        name: "Trash",
        modified: now,
        is_dir: true,
        //dir_id: 0.0,
        is_display: false,
        authority_files: []
      }
    ];
    await File.insertMany(root_files)

    const topDir = await File.findOne({ name: 'Top', modified: {"$gte": now}})
    const trashDir = await File.findOne({ name: 'Trash', modified: {"$gte": now} })
    //console.log(topDir)
    //console.log(trashDir)

    //dirコレクション
    var dirs = [
      { ancestor: topDir._id, descendant: topDir._id, depth: 0 },
      { ancestor: trashDir._id, descendant: trashDir._id, depth: 0 },
      { ancestor: topDir._id, descendant: trashDir._id, depth: 1 }
    ];
    await Dir.insertMany(dirs)

    // ===============================
    //  tenants collection
    // ===============================
    const tenant = new Tenant();
    tenant.name= tenantName;
    tenant.home_dir_id= topDir._id;
    tenant.trash_dir_id= trashDir._id;
    tenant.threshold= 1024 * 1024 * 1024 * 100;
    await tenant.save();

    // ===============================
    // groups collection
    // ===============================
    const group1 = new Group();
    group1.name= "全社";
    group1.description= "全社員が所属するグループ";
    group1.role_files= [];
    group1.tenant_id= tenant._id;
    await group1.save();

    const group2 = new Group();
    group2.name= "管理者";
    group2.description= "システム管理者";
    group2.role_files= [];
    group2.tenant_id= tenant._id;
    await group2.save();

  // ===============================
  //  users collection
  // ===============================

  var pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";

  const user1 = new User();
  user1.type = "user";
  user1.account_name= tenantName + '2';
  user1.name= user1.account_name
  user1.email= user1.account_name + '@' + tenantName;
  user1.password= pass;
  user1.enabled= true;
  user1.groups= [ (await Group.findOne({ name: "全社", tenant_id: tenant._id }, {_id: 1}))._id ];
  user1.tenant_id= tenant._id;
  await user1.save();
  console.log(`一般ユーザー ${user1.account_name}が作成されました`)
  const user2 = new User();
  user2.type = "user";
  user2.account_name= tenantName + '1';
  user2.name= user2.account_name;
  user2.email= user2.account_name + '@' + tenantName;
  user2.password= pass;
  user2.enabled= true;
  user2.groups= [ 
    (await Group.findOne({ name: "全社", tenant_id: tenant._id }, {_id: 1}))._id,
    (await Group.findOne({ name: "管理者", tenant_id: tenant._id }, {_id: 1}))._id,
  ];
  user2.tenant_id= tenant._id;
  await user2.save();
  console.log(`管理ユーザー ${user2.account_name}が作成されました`)

  // ===============================
  //  tags collection
  // ===============================
  await Tag.insertMany([
    {
      color: "#f55",
      label: "非表示",
      tenant_id: tenant._id
    }
  ])

  // ===============================
  //  display_items collection
  // ===============================
  await DisplayItem.insertMany([
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "",
      name: "file_checkbox",
      search_value_type: null,
      is_display: true,
      is_excel: false,
      is_search: false,
      width: "5%",
      order: 10
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "ファイル名",
      name: "name",
      search_value_type: "String",
      is_display: true,
      is_excel: false,
      is_search: true,
      width: "50%",
      order: 20
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "更新日時",
      name: "modified",
      search_value_type: "Date",
      value_type: "Date",
      is_display: true,
      is_excel: false,
      is_search: true,
      between: true,
      width: "20%",
      order: 30,
      default_sort: {desc: true}
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "メンバー",
      name: "authorities",
      search_value_type: "Select",
      value_type: "Select",
      is_display: true,
      is_excel: true,
      is_search: false,
      width: "15%",
      order: 40
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "操作",
      name: "action",
      search_value_type: null,
      is_display: true,
      is_excel: false,
      is_search: false,
      width: "10%",
      order: 50
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "お気に入り",
      name: "favorite",
      search_value_type: "Bool",
      value_type: "Bool",
      is_display: false,
      is_excel: false,
      is_search: false,
      order: 130
    },
    {
      tenant_id: tenant._id,
      meta_info_id: null,
      label: "タグ",
      name: "tag",
      search_value_type: "Select",
      value_type: "MultiSelect",
      is_display: false,
      is_excel: true,
      is_search: true,
      order: 140
    }
  ])

  // ===============================
  //  role_files collection
  // ===============================
  await RoleFile.insertMany([
    {
      name: "読み取りのみ",
      description: "",
      actions: [
        (await Action.findOne({ name: "list" }))._id,
        (await Action.findOne({ name: "detail" }))._id,
        (await Action.findOne({ name: "history" }))._id,
        (await Action.findOne({ name: "download" }))._id,
      ],
      tenant_id: tenant._id
    },
    {
      name: "編集可能",
      description: "読み取り + 書き込み",
      actions: [
        (await Action.findOne({ name: "list" }))._id,
        (await Action.findOne({ name: "detail" }))._id,
        (await Action.findOne({ name: "history" }))._id,
        (await Action.findOne({ name: "download" }))._id,
        (await Action.findOne({ name: "change-name" }))._id,
        (await Action.findOne({ name: "change-tag" }))._id,
        //(await Action.findOne({ name: "change-meta-info" }))._id,
        (await Action.findOne({ name: "upload" }))._id,
        (await Action.findOne({ name: "makedir" }))._id,
        (await Action.findOne({ name: "copy" }))._id,
        (await Action.findOne({ name: "restore" }))._id,
        (await Action.findOne({ name: "delete" }))._id,
        //(await Action.findOne({ name: "revert" }))._id
      ],
      tenant_id: tenant._id
    },
    {
      name: "フルコントロール",
      description: "読み取り + 書き込み + 権限変更",
      actions: [
        (await Action.findOne({ name: "list" }))._id,
        (await Action.findOne({ name: "detail" }))._id,
        (await Action.findOne({ name: "history" }))._id,
        (await Action.findOne({ name: "download" }))._id,
        (await Action.findOne({ name: "change-name" }))._id,
        (await Action.findOne({ name: "change-tag" }))._id,
        //(await Action.findOne({ name: "change-meta-info" }))._id,
        (await Action.findOne({ name: "upload" }))._id,
        (await Action.findOne({ name: "makedir" }))._id,
        (await Action.findOne({ name: "copy" }))._id,
        (await Action.findOne({ name: "restore" }))._id,
        (await Action.findOne({ name: "delete" }))._id,
        //(await Action.findOne({ name: "revert" }))._id,
        (await Action.findOne({ name: "authority" }))._id,
        (await Action.findOne({ name: "move" }))._id
      ],
      tenant_id: tenant._id
    }
  ])

  const roleMenu1 = new RoleMenu();

  roleMenu1.name= "一般ユーザ";
  roleMenu1.description= "";
  roleMenu1.menus= [
    (await Menu.findOne({ name: "home" }))._id,
    (await Menu.findOne({ name: "tags" }))._id,
  ];
  roleMenu1.tenant_id= tenant._id;
  await roleMenu1.save();

  const roleMenu2 = new RoleMenu();
  roleMenu2.name= "システム管理者";
  roleMenu2.description= "";
  roleMenu2.menus= [
    (await Menu.findOne({ name: "home" }))._id,
    (await Menu.findOne({ name: "tags" }))._id,
    (await Menu.findOne({ name: "analysis" }))._id,
    (await Menu.findOne({ name: "users" }))._id,
    (await Menu.findOne({ name: "groups" }))._id,
    (await Menu.findOne({ name: "role_files" }))._id,
    (await Menu.findOne({ name: "role_menus" }))._id,
    //(await Menu.findOne({ name: "meta_infos" }))._id
  ];
  roleMenu2.tenant_id= tenant._id;
  await roleMenu2.save();

  await AuthorityMenu.insertMany([{
    role_menus : roleMenu1._id,
    users : user1._id,
    groups : null
  },{
    role_menus : roleMenu2._id,
    users : user2._id,
    groups : null
  }])

  // await Preview.insertMany([{
  //   image: null
  // }]);

  const role_file_full_controll = await RoleFile.findOne({name:"フルコントロール", tenant_id: tenant._id});
  const role_file_read_only = await RoleFile.findOne({name:"読み取りのみ", tenant_id: tenant._id});

  await AuthorityFile.insertMany([{
    files: topDir._id,
    role_files : role_file_read_only._id,
    users : null,
    groups : group1._id
  },{
    files: trashDir._id,
    role_files : role_file_read_only._id,
    users : null,
    groups : group1._id
  },{
    files: topDir._id,
    role_files : role_file_full_controll._id,
    users : null,
    groups : group2._id
  },{
    files: trashDir._id,
    role_files : role_file_full_controll._id,
    users : null,
    groups : group2._id
  }]);

    // ===============================
    //  ダウンロードファイルの命名規則
    // ===============================
    var display_file_name_id = (await MetaInfo.findOne({name: "display_file_name"}))._id;
    var send_date_time_id = (await MetaInfo.findOne({name: "send_date_time"}))._id;
    await DownloadInfo.insertMany([{
      type: "file",
      value:`{${display_file_name_id}}{${send_date_time_id}:YYYYMMDD}{extension}`,
      tenant_id: tenant._id,
      extensionTarget: display_file_name_id
    }]);

  // ===============================
  //  テナント毎のグローバル設定(app_settings)
  // ===============================
  await AppSetting.insertMany([
    {
      tenant_id: tenant._id,
      // ファイル一覧の設定項目
      name: "unvisible_files_toggle",
      description: "非表示属性のファイルを表示/非表示するトグルを表示するか",
      enable: false,
      default_value: false
    },
    {
      tenant_id: tenant._id,
      name: "change_user_password_permission",
      description: "ユーザにパスワード変更の権限を許可するか",
      enable: true,
      default_value: false // 許可しない
    }
  ])


  }
  catch (e) {
    console.log(util.inspect(e, false, null));
    logger.error(e);
    process.exit();
  }
  finally {
    console.log("################# add tenant end #################");
    process.exit();
  }

}

export default task;
