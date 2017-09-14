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
    authorities: []
  },
  {
    name: "Trash",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
    is_display: false,
    authorities: []
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
  name: "hanako",
  email: "test",
  password: pass,
  enabled: true,
  groups: [ db.groups.findOne({ name: "全社" }, {_id: 1})._id ],
  tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
};

var user2 = {
  type: "user",
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
    description: "重要な資料",
    tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1} )._id
  },
  {
    color: "#111",
    label: "業務",
    description: "業務で利用する資料",
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
    value_type: "String"
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
    name: "read",
    label: "読み取り"
  },
  {
    name: "write",
    label: "書き込み"
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
      db.actions.findOne({ name: "read" })._id
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },
  {
    name: "編集可能",
    description: "読み取り + 書き込み",
    actions: [
      db.actions.findOne({ name: "read" })._id,
      db.actions.findOne({ name: "write" })._id
    ],
    tenant_id: db.tenants.findOne({ name: "test" })._id
  },
];

db.roles.insert(roles);
