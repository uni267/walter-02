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
      { $set: { name: '一般ユーザG' } }, { multi:false }
    );
    await Group.update(
      { name: "管理者", tenant_id: tenant._id },
      { $set: { name: '管理者G' } }, { multi:false }
    );
    const group_norm = await Group.findOne({ name: '一般ユーザG' } )
    const group_admin = await Group.findOne({ name: '管理者G' } )
    // 既存RoleMenuの削除
    const existing_rolemenu_ids = (await RoleMenu.find({ tenant_id: tenant._id})).map( rolemenu => rolemenu._id.toString() );
    await Promise.all(_.forEach(existing_rolemenu_ids, async id => {
      await AuthorityMenu.remove({ role_menus: Types.ObjectId(id) })
      await RoleMenu.remove({ _id: Types.ObjectId(id) })
    }))
    // RoleMenuの追加
    const roleMenu_norm = new RoleMenu();
    roleMenu_norm.name= "一般";
    roleMenu_norm.description= "";
    roleMenu_norm.menus= [
      (await Menu.findOne({ name: "home" }))._id,
    ];
    roleMenu_norm.tenant_id= tenant._id;
    await roleMenu_norm.save();

    const roleMenu_admin = new RoleMenu();
    roleMenu_admin.name= "システム管理";
    roleMenu_admin.description= "";
    roleMenu_admin.menus= [
      (await Menu.findOne({ name: "home" }))._id,
      (await Menu.findOne({ name: "tags" }))._id,
      (await Menu.findOne({ name: "users" }))._id,
    ];
    roleMenu_admin.tenant_id= tenant._id;
    await roleMenu_admin.save();

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
          (await Action.findOne({ name: "dir-authority" }))._id,
        ],
        tenant_id: tenant._id
      }
    ])

    const role_file_full_controll = await RoleFile.findOne({name:"フルコントロール", tenant_id: tenant._id});
    const role_file_read_only = await RoleFile.findOne({name:"読み取りのみ", tenant_id: tenant._id});

    // Topとtrashフォルダの権限設定
    await AuthorityFile.insertMany([
      {
        files: tenant.home_dir_id,
        role_files : role_file_full_controll._id,
        users : null,
        groups : group_admin._id
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
        groups : group_admin._id
      },
      // {
      //   files: tenant.trash_dir_id,
      //   role_files : role_file_read_only._id,
      //   users : null,
      //   groups : group_norm._id
      // },
    ]);

    //既存ユーザーの削除
    const existing_user_ids = (await User.find({ tenant_id: tenant._id })).map( user => user._id.toString() );
    await Promise.all(_.forEach(existing_user_ids, async id => {
      await AuthorityMenu.remove({ users: Types.ObjectId(id) })
      await User.remove({ _id: Types.ObjectId(id) })
    }))
    //初期ユーザー作成
    const pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";

    const user_admin = new User();
    user_admin.type = "user";
    user_admin.account_name= "admin";
    user_admin.name= "システム管理者";
    user_admin.email= `${user_admin.account_name}@${tenantName}`;
    user_admin.password= pass;
    user_admin.enabled= true;
    user_admin.groups= [
      //(await Group.findOne({ name: "一般ユーザG", tenant_id: tenant._id }, {_id: 1}))._id,
      (await Group.findOne({ name: "管理者G", tenant_id: tenant._id }, {_id: 1}))._id,
    ];
    user_admin.tenant_id= tenant._id;
    await user_admin.save();

    await AuthorityMenu.insertMany([
      {
        role_menus : roleMenu_admin._id,
        users : user_admin._id,
        groups : null
      },
    ])

    const normal_users = [
      {account_name: 'user01', name: '一般ユーザー１'},
    ]

    await Promise.all(_.map(normal_users, async inf => {
      const user = new User();
      user.type = "user";
      user.account_name= inf.account_name;
      user.name= inf.name;
      user.email= `${user.account_name}@${tenantName}`;
      user.password= pass;
      user.enabled= true;
      user.groups= [ (await Group.findOne({ name: "一般ユーザG", tenant_id: tenant._id }, {_id: 1}))._id ];
      user.tenant_id= tenant._id;
      await user.save();
      await AuthorityMenu.insertMany([{
          role_menus : roleMenu_norm._id,
          users : user._id,
          groups : null
      }])
     }))

  // ===============================
  //  tags collection
  // ===============================
  await Tag.remove({tenant_id: tenant._id})  //テナントid一致分を全てクリア
  const tags = [
    {color: "#f44336", label: "分析種 経済分析"},
    {color: "#e91e63", label: "分析種 社会分析"},
    {color: "#9c27b0", label: "分析種 その他"},
    {color: "#673ab7", label: "分野 暮らし"},
    {color: "#3f51b5", label: "分野 環境"},
    {color: "#2196f3", label: "分野 農林業"},
    {color: "#03a9f4", label: "分野 漁業"},
    {color: "#00bcd4", label: "分野 産業"},
    {color: "#009688", label: "分野 観光"},
    {color: "#4caf50", label: "分野 移住定住"},
    {color: "#8bc34a", label: "分野 健康・医療"},
    {color: "#cddc39", label: "分野 福祉"},
    {color: "#ffeb3b", label: "分野 教育"},
    {color: "#ffc107", label: "分野 文化"},
    {color: "#ff9800", label: "分野 まちづくり"},
    {color: "#ff5722", label: "分野 交通"},
    {color: "#795548", label: "分野 防災"},
    {color: "#607d8b", label: "分野 その他"},
  ]
  await Promise.all(_.map(tags, async tag => (
    await Tag.insertMany([{
        color: tag.color,
        label: tag.label,
        tenant_id: tenant._id
    }])
  )))

  const existing_file_ids = (await Dir.find({ ancestor: tenant.home_dir_id, depth: 1, descendant: {'$ne': tenant.trash_dir_id}  })).map( dir => dir.descendant.toString() );
  await Promise.all(_.map(existing_file_ids, async id => {
    await File.remove({ _id: Types.ObjectId(id) })
    await AuthorityFile.remove({ files: Types.ObjectId(id) })
    await Dir.remove({ descendant: Types.ObjectId(id) })
  }))

  // //デフォルトフォルダの準備
  //   const dir_public = new File();
  //   dir_public.name = 'Public';
  //   dir_public.modified = moment().format("YYYY-MM-DD HH:mm:ss");
  //   dir_public.is_dir = true;
  //   dir_public.dir_id = tenant.home_dir_id;
  //   dir_public.is_display = true;
  //   dir_public.is_star = false;
  //   dir_public.tags = [];
  //   dir_public.histories = [];
  //   dir_public.authorities = [];

  //   // 管理者Gフルコントロール
  //   const authPublic_admin_full = new AuthorityFile();
  //   authPublic_admin_full.users = null;
  //   authPublic_admin_full.groups = group_admin._id;
  //   authPublic_admin_full.files = dir_public;
  //   authPublic_admin_full.role_files = role_file_full_controll;
  //   // 一般ユーザーG閲覧
  //   const authPublic_norm_read = new AuthorityFile();
  //   authPublic_norm_read.users = null
  //   authPublic_norm_read.groups = group_norm._id;
  //   authPublic_norm_read.files = dir_public;
  //   authPublic_norm_read.role_files = role_file_read_only;
  //   dir_public.authority_files = [ authPublic_admin_full, authPublic_norm_read ];

  //   await dir_public.save()
  //   await authPublic_admin_full.save()
  //   await authPublic_norm_read.save()
  //   await Dir.insertMany([
  //     {
  //       ancestor: dir_public._id,
  //       descendant: dir_public._id,
  //       depth: 0,
  //     },
  //     {
  //       ancestor: tenant.home_dir_id,
  //       descendant: dir_public._id,
  //       depth: 1,
  //     },
  //   ])
  //   console.log(`フォルダ '${dir_public.name}' が作成されました`)

  //   const dir_private = new File();
  //   dir_private.name = 'Private';
  //   dir_private.modified = moment().format("YYYY-MM-DD HH:mm:ss");
  //   dir_private.is_dir = true;
  //   dir_private.dir_id = tenant.home_dir_id;
  //   dir_private.is_display = true;
  //   dir_private.is_star = false;
  //   dir_private.tags = [];
  //   dir_private.histories = [];
  //   dir_private.authorities = [];

  //   // 管理者Gフルコントロール
  //   const authPrivate_admin_full = new AuthorityFile();
  //   authPrivate_admin_full.users = null;
  //   authPrivate_admin_full.groups = group_admin._id;
  //   authPrivate_admin_full.files = dir_private;
  //   authPrivate_admin_full.role_files = role_file_full_controll;
  //   dir_private.authority_files = [ authPrivate_admin_full ];

  //   await dir_private.save()
  //   await authPrivate_admin_full.save()
  //   await Dir.insertMany([
  //     {
  //       ancestor: dir_private._id,
  //       descendant: dir_private._id,
  //       depth: 0,
  //     },
  //     {
  //       ancestor: tenant.home_dir_id,
  //       descendant: dir_private._id,
  //       depth: 1,
  //     },
  //   ])
  //   console.log(`フォルダ '${dir_private.name}' が作成されました`)

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
