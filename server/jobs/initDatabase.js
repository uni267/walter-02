// ===============================
//  all collection drop
// ===============================
db.files.drop();
db.dirs.drop();
db.tenants.drop();
db.groups.drop();
db.users.drop();
db.tags.drop();
db.meta_infos.drop();
db.display_items.drop();
db.actions.drop();
db.menus.drop();
db.role_files.drop();
db.role_menus.drop();
db.previews.drop();
db.authority_files.drop();
db.authority_menus.drop();
db.notifications.drop();
db.file_meta_infos.drop();
db.download_infos.drop();
db.app_settings.drop();

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

db.actions.insert(actions);

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
db.menus.insert(menus);

var preview = {
  image: null
};
db.previews.insert(preview);

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
db.meta_infos.insert(meta_infos);
