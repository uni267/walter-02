// files
let root = {
  name: "Top",
  modified: "2017-01-01 10:00",
  is_dir: true,
  dir_id: 0,
  is_display: false,
  authorities: []
};

db.files.insert(root);

let rootDir = db.files.find({ name: "Top" });

let file1 = {
  name: "契約書2017-01-20.pdf",
  modified: "2017-01-20 9:30",
  is_dir: false,
  dir_id: rootDir._id,
  is_display: true,
  is_star: false,
  tags: [
    {
      id: 1,
      color: "#c62828",
      label: "重要"
    },
    {
      id: 2,
      color: "#42A5F5",
      label: "業務"
    }
  ],
  histories: [
    {
      id: 1,
      user: { name: "user01" },
      action: "ファイルを新規作成",
      modified: "2016-06-01 10:00",
      body: "新ファイル名はxxx.doc"
    }
  ],
  authorities: [
    {
      id: 1,
      user: {
        id: 1,
        type: "user",
        name: "user01",
        name_jp: "ユーザ 太郎",
        is_owner: true
      },
      role: {
        id: 3,
        name: "フルコントロール",
        actions: ["read", "write", "authority"]
      }
    }
  ],
  metaInfo: [
    {id: 1, key: "契約書No", value: 201606010001}
  ]
};

db.files.insert(file1);

let dir1 = {
  name: "folder1",
  modified: "2017-01-01 10:00",
  is_dir: true,
  dir_id: rootDir._id,
  is_display: true,
  is_star: false,
  tags: [],
  histories: [
    {
      id: 1,
      user: { name: "user01" },
      action: "新規作成",
      modified: "2016-12-01 10:00",
      body: "新: folder1"
    },
  ],
  authorities: [
    {
      id: 1,
      user: {
        id: 1,
        type: "user",
        name: "user01",
        name_jp: "ユーザ 太郎",
        is_owner: true
      },
      role: {
        id: 3,
        name: "フルコントロール",
        actions: ["read", "write", "authority"]
      }
    }
  ]
};

db.files.insert(dir1);

// tenants

let tenant = {
  name: "test",
  home_dir_id: rootDir._id
};

db.tenants.insert(tenant);

// users

let pass = "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff";

let user = {
  type: "user",
  name: "hanako",
  email: "test",
  password: "ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff",
  tenant_id: ObjectId("59952dbc9970861eee9c743e")
};


// dirs
db.files.find({ name: "Top" });

let route1 = {
  ancestor: ObjectId("59952cf89970861eee9c743b"),
  descendant: ObjectId("59952cf89970861eee9c743b"),
  depth: 0
};

db.dirs.insert(route1);

db.files.find({ name: "folder1" });

let route2 = {
  ancestor: ObjectId("59952d8f9970861eee9c743d"),
  descendant: ObjectId("59952d8f9970861eee9c743d"),
  depth: 0
};

db.dirs.insert(route2);

let route3 = {
  ancestor: ObjectId("59952cf89970861eee9c743b"),
  descendant: ObjectId("59952d8f9970861eee9c743d"),
  depth: 1
};

db.dirs.insert(route3);
