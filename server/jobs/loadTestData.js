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
db.actions.drop();
db.roles.drop();
db.previews.drop();
db.authority_files.drop();

// ===============================
//  files collection
// ===============================

var files = [
  {
    name: "Top",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
    is_display: false,
    authority_files: []
  },
  {
    name: "Trash",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
    is_display: false,
    authority_files: []
  }
];

db.files.insert(files);

// ===============================
//  dirs collection
// ===============================

var top_id = db.files.findOne({ name: "Top" }, { _id: 1 })._id;
var trash_id = db.files.findOne({ name: "Trash" }, { _id: 1 })._id;

var dirs = [
  { ancestor: top_id, descendant: top_id, depth: 0 },
  { ancestor: trash_id, descendant: trash_id, depth: 0 },
  { ancestor: top_id, descendant: trash_id, depth: 1 }
];

db.dirs.insert(dirs);

// ===============================
//  tenants collection
// ===============================

// tenants
var tenant = { name: "test", home_dir_id: top_id, trash_dir_id: trash_id };
db.tenants.insert(tenant);

// ===============================
// groups collection
// ===============================
var groups = [
  {
    name: "全社",
    description: "全社員が所属するグループ",
    roles: [],
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
  },
  {
    name: "管理者",
    description: "システム管理者",
    roles: [],
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
  }
];

db.groups.insert(groups);

// ===============================
//  users collection
// ===============================

var pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";

var user1 = {
  type: "user",
  account_name: "hanako",
  name: "hanako",
  email: "test",
  password: pass,
  enabled: true,
  groups: [ db.groups.findOne({ name: "全社" }, {_id: 1})._id ],
  tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
};

var user2 = {
  type: "user",
  account_name: "taro",
  name: "taro",
  email: "taro",
  password: pass,
  enabled: true,
  groups: [ db.groups.findOne({ name: "全社" }, {_id: 1})._id ],
  tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
};

db.users.insert(user1);
db.users.insert(user2);

// ===============================
//  tags collection
// ===============================

var tags = [
  {
    color: "#000",
    label: "重要",
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1} )._id
  },
  {
    color: "#111",
    label: "業務",
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1} )._id
  }
];

db.tags.insert(tags);

// ===============================
//  meta_infos collection
// ===============================

var tenant = db.tenants.findOne({ name: "test" });

var meta_infos = [
  {
    tenant_id: tenant._id,
    key: "ファイル名",
    key_type: "name",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    key: "お気に入り",
    key_type: "is_star",
    value_type: "Bool"
  },
  {
    tenant_id: tenant._id,
    key: "タグ",
    key_type: "tags",
    value_type: "Tag"
  },
  {
    tenant_id: tenant._id,
    key: "更新日時(より小さい)",
    key_type: "modified_less",
    value_type: "Date"
  },
  {
    tenant_id: tenant._id,
    key: "更新日時(より大きい)",
    key_type: "modified_greater",
    value_type: "Date"
  },
  {
    tenant_id: tenant._id,
    key: "取引先コード",
    key_type: "meta",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    key: "取引先名",
    key_type: "meta",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    key: "明細番号",
    key_type: "meta",
    value_type: "Number"
  }
];

db.meta_infos.insert(meta_infos);

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
  {
    name: "revert",
    label: "ゴミ箱から元に戻す"
  },
  {
    name: "authority",
    label: "権限変更"
  }
];

db.actions.insert(actions);

// ===============================
//  roles collection
// ===============================

var roles = [
  {
    name: "読み取りのみ",
    description: "",
    actions: [
      db.actions.findOne({ name: "list" })._id,
      db.actions.findOne({ name: "detail" })._id,
      db.actions.findOne({ name: "history" })._id,
      db.actions.findOne({ name: "download" })._id,
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },
  {
    name: "編集可能",
    description: "読み取り + 書き込み",
    actions: [
      db.actions.findOne({ name: "list" })._id,
      db.actions.findOne({ name: "detail" })._id,
      db.actions.findOne({ name: "history" })._id,
      db.actions.findOne({ name: "download" })._id,
      db.actions.findOne({ name: "change-name" })._id,
      db.actions.findOne({ name: "change-tag" })._id,
      db.actions.findOne({ name: "change-meta-info" })._id,
      db.actions.findOne({ name: "upload" })._id,
      db.actions.findOne({ name: "makedir" })._id,
      db.actions.findOne({ name: "copy" })._id,
      db.actions.findOne({ name: "restore" })._id,
      db.actions.findOne({ name: "delete" })._id,
      db.actions.findOne({ name: "revert" })._id
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },
  {
    name: "フルコントロール",
    description: "読み取り + 書き込み + 権限変更",
    actions: [
      db.actions.findOne({ name: "list" })._id,
      db.actions.findOne({ name: "detail" })._id,
      db.actions.findOne({ name: "history" })._id,
      db.actions.findOne({ name: "download" })._id,
      db.actions.findOne({ name: "change-name" })._id,
      db.actions.findOne({ name: "change-tag" })._id,
      db.actions.findOne({ name: "change-meta-info" })._id,
      db.actions.findOne({ name: "upload" })._id,
      db.actions.findOne({ name: "makedir" })._id,
      db.actions.findOne({ name: "copy" })._id,
      db.actions.findOne({ name: "restore" })._id,
      db.actions.findOne({ name: "delete" })._id,
      db.actions.findOne({ name: "revert" })._id,
      db.actions.findOne({ name: "authority" })._id,

    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  }
];

db.roles.insert(roles);

var preview = {
  image: null
};

db.previews.insert(preview);


var authority_files = {
  roles : null,
  users : null,
  groups : null
};

db.authority_files.insert(authority_file);
