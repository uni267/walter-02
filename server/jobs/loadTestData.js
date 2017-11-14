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
var tenant = {
  name: "test",
  home_dir_id: top_id,
  trash_dir_id: trash_id,
  threshold: 1024 * 1024 * 1024 * 100
};
db.tenants.insert(tenant);

// ===============================
// groups collection
// ===============================
var groups = [
  {
    name: "全社",
    description: "全社員が所属するグループ",
    role_files: [],
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
  },
  {
    name: "管理者",
    description: "システム管理者",
    role_files: [],
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
    label: "取引先コード",
    name: "",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    label: "取引先名",
    name: "",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    label: "明細番号",
    name: "",
    value_type: "Number"
  }
];

db.meta_infos.insert(meta_infos);

// ===============================
//  display_items collection
// ===============================
var tenant = db.tenants.findOne({ name: "test" });

var display_items = [
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "",
    name: "file_checkbox",
    search_value_type: null,
    is_display: true,
    order: 1,
    width: "5%"
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "ファイル名",
    name: "name",
    search_value_type: "String",
    is_display: true,
    order: 2,
    width: "50%"
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "更新日時",
    name: "modified",
    search_value_type: "Date",
    is_display: true,
    order: 3,
    width: "20%"
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "メンバー",
    name: "authorities",
    search_value_type: "Select",
    value_type: "String",
    is_display: true,
    order: 4,
    width: "15%"
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "操作",
    name: "action",
    search_value_type: null,
    is_display: true,
    order: 5,
    width: "10%"
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "お気に入り",
    name: "favorite",
    search_value_type: "Bool",
    is_display: false,
    order: 99999
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "タグ",
    name: "tag",
    search_value_type: "Select",
    is_display: false,
    order: 99999
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "更新日時(より小さい)",
    name: "modified_less",
    search_value_type: "Date",
    is_display: false,
    order: 99999
  },
  {
    tenant_id: tenant._id,
    meta_info_id: null,
    label: "更新日時(より大きい)",
    name: "modified_greater",
    search_value_type: "Date",
    is_display: false,
    order: 99999
  }
];

db.display_items.insert(display_items);

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
//  role_files collection
// ===============================

var role_files = [
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

db.role_files.insert(role_files);

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

var role_menus = [
  {
    name: "一般ユーザ",
    description: "",
    menus: [
      db.menus.findOne({ name: "home" })._id,
      db.menus.findOne({ name: "tags" })._id,
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },
  {
    name: "システム管理者",
    description: "",
    menus: [
      db.menus.findOne({ name: "home" })._id,
      db.menus.findOne({ name: "tags" })._id,
      db.menus.findOne({ name: "analysis" })._id,
      db.menus.findOne({ name: "users" })._id,
      db.menus.findOne({ name: "groups" })._id,
      db.menus.findOne({ name: "role_files" })._id,
      db.menus.findOne({ name: "role_menus" })._id,
      db.menus.findOne({ name: "meta_infos" })._id
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },

]

db.role_menus.insert(role_menus);

var authority_menus = [{
  role_menus : db.role_menus.findOne({ name: "一般ユーザ"})._id,
  users : db.users.findOne({ name: "hanako"})._id,
  groups : null
},{
  role_menus : db.role_menus.findOne({ name: "システム管理者"})._id,
  users : db.users.findOne({ name: "taro"})._id,
  groups : null
}]

db.authority_menus.insert(authority_menus);


var preview = {
  image: null
};

db.previews.insert(preview);


var authority_files = {
  role_files : null,
  users : null,
  groups : null
};

db.authority_files.insert(authority_files);

// ===============================
//  ユニットテスト用(dirs)
// ===============================

var folder1 = {
  is_star: false,
  is_display: true,
  dir_id: db.files.findOne({ name: "Top" })._id,
  is_dir: true,
  name: "folder1",
  is_crypted: false,
  histories: [
    {
      body: "",
      action: "新規作成",
      user: db.users.findOne({ name: "hanako" })._id,
      modified: "2017-01-01 10:00"
    }
  ],
  tags: [],
  is_deleted: false,
  modified: "2017-01-01 10:00"
};

db.files.insert(folder1);

var folder1_1 = {
  is_star: false,
  is_display: true,
  dir_id: db.files.findOne({ name: "folder1" })._id,
  is_dir: true,
  name: "folder1-1",
  is_crypted: false,
  histories: [
    {
      body: "",
      action: "新規作成",
      user: db.users.findOne({ name: "hanako" })._id,
      modified: "2017-01-01 10:00"
    }
  ],
  tags: [],
  is_deleted: false,
  modified: "2017-01-01 10:00"
};

db.files.insert(folder1_1);

var addDirs = [
  {
    ancestor: db.files.findOne({ name: "folder1" })._id,
    descendant: db.files.findOne({ name: "folder1" })._id,
    depth: 0
  },
  {
    ancestor: db.files.findOne({ name: "folder1-1" })._id,
    descendant: db.files.findOne({ name: "folder1-1" })._id,
    depth: 0
  },
  {
    ancestor: db.files.findOne({ name: "Top" })._id,
    descendant: db.files.findOne({ name: "folder1" })._id,
    depth: 1
  },
  {
    ancestor: db.files.findOne({ name: "Top" })._id,
    descendant: db.files.findOne({ name: "folder1-1" })._id,
    depth: 2
  },
  {
    ancestor: db.files.findOne({ name: "folder1" })._id,
    descendant: db.files.findOne({ name: "folder1-1" })._id,
    depth: 1
  }
];

db.dirs.insert(addDirs);

var addAuthFiles = [
  {
    role_files: db.role_files.findOne({ name: "フルコントロール" })._id,
    users: db.users.findOne({ name: "hanako" })._id,
    files: db.files.findOne({ name: "folder1" })._id
  },
  {
    role_files: db.role_files.findOne({ name: "フルコントロール" })._id,
    users: db.users.findOne({ name: "hanako" })._id,
    files: db.files.findOne({ name: "folder1-1" })._id
  }
];

db.authority_files.insert(addAuthFiles);
