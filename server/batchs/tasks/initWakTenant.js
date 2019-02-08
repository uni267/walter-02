import co from "co";
import { Types } from "mongoose";
import moment from "moment";
import util from "util";
import * as _ from "lodash";

// logger
import logger from "../../lib/logger";

// models
import Tenant from "../../lib/models/Tenant";
import Dir from "../../lib/models/Dir";
import File from "../../lib/models/File";
import Group from "../../lib/models/Group";
import User from "../../lib/models/User";
import Action from "../../lib/models/Action";
import Menu from "../../lib/models/Menu";
import RoleFile from "../../lib/models/RoleFile";
import RoleMenu from "../../lib/models/RoleMenu";
import AuthorityMenu from "../../lib/models/AuthorityMenu";
import AuthorityFile from "../../lib/models/AuthorityFile";
import Preview from "../../lib/models/Preview";
import AppSetting from "../../lib/models/AppSetting";
import DownloadInfo from "../../lib/models/DownloadInfo";

import Tag from "../../lib/models/Tag";
import DisplayItem from "../../lib/models/DisplayItem";
import MetaInfo from "../../lib/models/MetaInfo";

const task = async () => {
  try{
    console.log('addTenantバッチにより追加されたテナントに対し、県庁向け設定にカスタマイズします。')    

    if (! process.argv[3]) throw new Error("引数にテナント名を指定する必要があります");
    //テナント名をfindしてなければアウト
    const tenantName = process.argv[3]
    const tenant = await Tenant.findOne({ name: tenantName})
    if(!tenant) throw new Error("存在しないテナントです");
    console.log(`テナント ${tenant.name}(${tenant._id}) の設定を県庁向けに更新します。`)    
    console.log('start')    

    // ===============================
    //  テナント毎のグローバル設定(app_settings)
    // ===============================
    await AppSetting.remove({ tenant_id: tenant._id })
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
      },
      {
        tenant_id: tenant._id,
        name: "inherit_parent_dir_auth",
        description: "アップロード時に親フォルダの割り当てられたユーザファイル操作権限を継承する",
        enable: true,
        default_value: false // 許可しない
      },
      {
        tenant_id: tenant._id,
        name: "show_trash_icon_by_own_auth",
        description: "ごみ箱アイコンの表示をTrashフォルダの権限に負う",
        enable: true,
        default_value: false // 許可しない
      },
    ])

    // ユーザーグループの変更
    await Group.update(
      { name: "全社", tenant_id: tenant._id },
      { $set: { name: '基本ユーザーG' } }, { multi:false }
    );    
    await Group.update(
      { name: "管理者", tenant_id: tenant._id },
      { $set: { name: 'ファイル管理者G' } }, { multi:false }
    );    
    const group_norm = await Group.findOne({ name: '基本ユーザーG' } )
    const group_file = await Group.findOne({ name: 'ファイル管理者G' } )
    // 既存RoleMenuの削除
    const existing_rolemenu_ids = (await RoleMenu.find({ tenant_id: tenant._id})).map( rolemenu => rolemenu._id.toString() );
    await Promise.all(_.forEach(existing_rolemenu_ids, async id => {
      await AuthorityMenu.remove({ role_menus: Types.ObjectId(id) })
      await RoleMenu.remove({ _id: Types.ObjectId(id) })
    }))
    // RoleMenuの追加
    const roleMenu_norm = new RoleMenu();
    roleMenu_norm.name= "一般ユーザ";
    roleMenu_norm.description= "";
    roleMenu_norm.menus= [
      (await Menu.findOne({ name: "home" }))._id,
    ];
    roleMenu_norm.tenant_id= tenant._id;
    await roleMenu_norm.save();
    
    const roleMenu_file = new RoleMenu();
    roleMenu_file.name= "ファイル管理者";
    roleMenu_file.description= "";
    roleMenu_file.menus= [
      (await Menu.findOne({ name: "home" }))._id,
      (await Menu.findOne({ name: "tags" }))._id,
      (await Menu.findOne({ name: "users" }))._id,
    ];
    roleMenu_file.tenant_id= tenant._id;
    await roleMenu_file.save();

    const roleMenu_sa = new RoleMenu();
    roleMenu_sa.name= "システム管理者";
    roleMenu_sa.description= "";
    roleMenu_sa.menus= [
      (await Menu.findOne({ name: "home" }))._id,
      (await Menu.findOne({ name: "tags" }))._id,
      (await Menu.findOne({ name: "analysis" }))._id,
      (await Menu.findOne({ name: "users" }))._id,
      (await Menu.findOne({ name: "groups" }))._id,
      (await Menu.findOne({ name: "role_files" }))._id,
      (await Menu.findOne({ name: "role_menus" }))._id,
    ];
    roleMenu_sa.tenant_id= tenant._id;
    await roleMenu_sa.save();

    //既存RoleFileの削除
    const existing_rolefile_ids = (await RoleFile.find({ tenant_id: tenant._id})).map( rolefile => rolefile._id.toString() );
    await Promise.all(_.forEach(existing_rolefile_ids, async id => {
      await AuthorityFile.remove({ role_files: Types.ObjectId(id) })
      await RoleFile.remove({ _id: Types.ObjectId(id) })
    }))

    // RoleFileの追加
    await RoleFile.insertMany([
      {
        name: "読み取りのみ",
        description: "",
        actions: [
          (await Action.findOne({ name: "list" }))._id,
          (await Action.findOne({ name: "detail" }))._id,
          (await Action.findOne({ name: "download" }))._id,
        ],
        tenant_id: tenant._id
      },
      {
        name: "読み取り+アップロード",
        description: "読み取り+アップロード",
        actions: [
          (await Action.findOne({ name: "list" }))._id,
          (await Action.findOne({ name: "detail" }))._id,
          (await Action.findOne({ name: "download" }))._id,
          (await Action.findOne({ name: "upload" }))._id,
        ],
        tenant_id: tenant._id
      },
      {
        name: "フルコントロール",
        description: "読み取り + 書き込み + 権限変更",
        actions: [
          (await Action.findOne({ name: "list" }))._id,
          (await Action.findOne({ name: "detail" }))._id,
          (await Action.findOne({ name: "download" }))._id,
          (await Action.findOne({ name: "change-name" }))._id,
          (await Action.findOne({ name: "change-tag" }))._id,
          (await Action.findOne({ name: "upload" }))._id,
          (await Action.findOne({ name: "makedir" }))._id,
          (await Action.findOne({ name: "move" }))._id,
          (await Action.findOne({ name: "restore" }))._id,
          (await Action.findOne({ name: "delete" }))._id,
          (await Action.findOne({ name: "authority" }))._id,
        ],
        tenant_id: tenant._id
      }
    ])
  
    const role_file_full_controll = await RoleFile.findOne({name:"フルコントロール", tenant_id: tenant._id});
    const role_file_read_upload = await RoleFile.findOne({name:"読み取り+アップロード", tenant_id: tenant._id});
    const role_file_read_only = await RoleFile.findOne({name:"読み取りのみ", tenant_id: tenant._id});
  
    // Topとtrashフォルダの権限設定
    await AuthorityFile.insertMany([
      {
        files: tenant.home_dir_id,
        role_files : role_file_full_controll._id,
        users : null,
        groups : group_file._id
      },
      {
        files: tenant.home_dir_id,
        role_files : role_file_read_only._id,
        users : null,
        groups : group_norm._id
      },
      {
        files: tenant.trash_dir_id,
        role_files : role_file_full_controll._id,
        users : null,
        groups : group_file._id
      },
      {
        files: tenant.trash_dir_id,
        role_files : role_file_read_only._id,
        users : null,
        groups : group_norm._id
      },
    ]);
    
    //既存ユーザーの削除
    const existing_user_ids = (await User.find({ tenant_id: tenant._id })).map( user => user._id.toString() );
    await Promise.all(_.forEach(existing_user_ids, async id => {
      await AuthorityMenu.remove({ users: Types.ObjectId(id) })
      await User.remove({ _id: Types.ObjectId(id) })
    }))
    //初期ユーザー作成
    const pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";
    const user_sa = new User();
    user_sa.type = "user";
    user_sa.account_name= "cyber-sa";
    user_sa.name= "システム管理者";
    user_sa.email= `${user_sa.account_name}@${tenantName}`;
    user_sa.password= pass;
    user_sa.enabled= true;
    user_sa.groups= [ (await Group.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, {_id: 1}))._id ];
    user_sa.tenant_id= tenant._id;
    await user_sa.save();

    const user_center = new User();
    user_center.type = "user";
    user_center.account_name= "wakayama";
    user_center.name= "管理者";
    user_center.email= `${user_sa.account_name}@${tenantName}`;
    user_center.password= pass;
    user_center.enabled= true;
    user_center.groups= [
      (await Group.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, {_id: 1}))._id,
      (await Group.findOne({ name: "ファイル管理者G", tenant_id: tenant._id }, {_id: 1}))._id,
    ];
    user_center.tenant_id= tenant._id;
    await user_center.save();

    const user_nourin = new User();
    user_nourin.type = "user";
    user_nourin.account_name= "nourin";
    user_nourin.name= "農林水産部";
    user_nourin.email= `${user_sa.account_name}@${tenantName}`;
    user_nourin.password= pass;
    user_nourin.enabled= true;
    user_nourin.groups= [ (await Group.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, {_id: 1}))._id ];
    user_nourin.tenant_id= tenant._id;
    await user_nourin.save();

    const user_soumu = new User();
    user_soumu.type = "user";
    user_soumu.account_name= "soumu";
    user_soumu.name= "総務部";
    user_soumu.email= `${user_sa.account_name}@${tenantName}`;
    user_soumu.password= pass;
    user_soumu.enabled= true;
    user_soumu.groups= [ (await Group.findOne({ name: "基本ユーザーG", tenant_id: tenant._id }, {_id: 1}))._id ];
    user_soumu.tenant_id= tenant._id;
    await user_soumu.save();
  
    await AuthorityMenu.insertMany([
      {
        role_menus : roleMenu_sa._id,
        users : user_sa._id,
        groups : null
      },
      {
        role_menus : roleMenu_file._id,
        users : user_center._id,
        groups : null
      },
      {
        role_menus : roleMenu_norm._id,
        users : user_nourin._id,
        groups : null
      },
      {
        role_menus : roleMenu_norm._id,
        users : user_soumu._id,
        groups : null
      },
    ])

  // ===============================
  //  tags collection
  // ===============================
  await Tag.remove({})  //全てクリア 
  await Tag.insertMany([
    {
      color: "#f55",
      label: "分析種 経済分析",
      tenant_id: tenant._id
    }
  ])

  const existing_file_ids = (await Dir.find({ ancestor: tenant.home_dir_id, depth: 1, descendant: {'$ne': tenant.trash_dir_id}  })).map( dir => dir.descendant.toString() );
  await Promise.all(_.forEach(existing_file_ids, async id => {
    await File.remove({ _id: Types.ObjectId(id) })
    await AuthorityFile.remove({ files: Types.ObjectId(id) })
    await Dir.remove({ descendant: Types.ObjectId(id) })
  }))

  //デフォルトフォルダの準備  
  const default_folders = [
    {name: '農林水産部', user: user_nourin },
    {name: '総務部', user: user_soumu },
  ];

  for(let i = 0;i < default_folders.length; i++){
    const inf = default_folders[i];
    const dir = new File();
    dir.name = inf.name;
    dir.modified = moment().format("YYYY-MM-DD HH:mm:ss");
    dir.is_dir = true;
    dir.dir_id = tenant.home_dir_id;
    dir.is_display = true;
    dir.is_star = false;
    dir.tags = [];
    dir.histories = [];
    dir.authorities = [];

    // 管理者フルコントロール
    const authFileDefault = new AuthorityFile();
    authFileDefault.users = user_center;
    authFileDefault.files = dir;
    authFileDefault.role_files = role_file_full_controll;
    // 共有ユーザー
    const authFileShare = new AuthorityFile();
    authFileShare.users = inf.user;
    authFileShare.files = dir;
    authFileShare.role_files = role_file_full_controll;
    dir.authority_files = [ authFileDefault, authFileShare ];
    console.log(`フォルダ '${inf.name}' が作成開始`)

    await dir.save()
    await authFileDefault.save()
    await authFileShare.save()
    await Dir.insertMany([
      {
        ancestor: dir._id,
        descendant: dir._id,
        depth: 0,
      },
      {
        ancestor: tenant.home_dir_id,
        descendant: dir._id,
        depth: 1,
      },
    ])
    console.log(`フォルダ '${inf.name}' が作成されました`)
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
