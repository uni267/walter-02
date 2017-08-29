// ===============================
//  all collection drop
// ===============================
db.files.drop();
db.dirs.drop();
db.tenants.drop();
db.users.drop();
db.tags.drop();

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
//  users collection
// =============================== 

var pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";

var user = {
  type: "user",
  name: "hanako",
  email: "test",
  password: pass,
  tenant_id: db.tenants.findOne({ name: "test" }, { _id: 1 })._id
};

db.users.insert(user);

// ===============================
//  tags collection
// ===============================

var tags = [
  {
    "color" : "#000",
    "label" : "重要"
  },
  {
    "color" : "#111",
    "label" : "業務"
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
    key: "取引先コード",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    key: "取引先名",
    value_type: "String"
  },
  {
    tenant_id: tenant._id,
    key: "明細番号",
    value_type: "Number"
  }
];
