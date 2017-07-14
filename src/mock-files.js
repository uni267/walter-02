const FILES = [
  {
    id: 0,
    name: "Top",
    modified: "2017-01-01 10:00",
    owner: "user01",
    is_dir: true,
    dir_id: 0,
    is_display: false,
    authorities: []
  },
  {
    id: 1,
    name: "交通費領収書2017-01-20.pdf",
    modified: "2017-01-20 9:30",
    owner: "user01",
    is_dir: false,
    dir_id: 0,
    is_display: true,
    is_star: false,
    histories: [
      {
        id: 3,
        user: { name: "user01" },
        action: "ファイル名を変更",
        modified: "2016-12-01 10:00",
        body: "旧ファイル名はxxy.doc, 新ファイル名はxyy.doc"
      },
      {
        id: 2,
        user: { name: "user01" },
        action: "ファイル名を変更",
        modified: "2016-06-01 10:00",
        body: "旧ファイル名はxxx.doc, 新ファイル名はxxy.doc"
      },
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
      },
      {
        id: 2,
        user: {
          id: 2,
          type: "user",
          name: "user02",
          name_jp: "ユーザ 次郎",
          is_owner: false
        },
        role: {
          id: 1,
          name: "読み取り専用",
          actions: ["read"]
        }
      }
    ]
  },
  {
    id: 2,
    name: "宿泊領収書2017-02-01.pdf",
    modified: "2017-02-01 10:30",
    owner: "user01",
    is_dir: false,
    dir_id: 0,
    is_display: true,
    is_star: false,
    histories: [
      {
        id: 2,
        user: { name: "user01" },
        action: "ファイル名変更",
        modified: "2016-12-01 10:00",
        body: "旧: xxy.doc, 新: xyy.doc"
      },
      {
        id: 1,
        user: { name: "user01" },
        action: "ファイル名変更",
        modified: "2016-06-01 10:00",
        body: "旧: xxx.doc, 新: xxy.doc"
      }
    ]
  },
  {
    id: 3,
    name: "領収書2017-02-03.pdf",
    modified: "2017-02-03 14:00",
    owner: "user01",
    is_dir: false,
    dir_id: 0,
    is_display: true,
    is_star: true,
    histories: [
      {
        id: 2,
        user: { name: "user01" },
        action: "ファイル名変更",
        modified: "2016-12-01 10:00",
        body: "旧: xxy.doc, 新: xyy.doc"
      },
      {
        id: 1,
        user: { name: "user01" },
        action: "ファイル名変更",
        modified: "2016-06-01 10:00",
        body: "旧: xxx.doc, 新: xxy.doc"
      }
    ]
  },
  {
    id: 4,
    name: "新しいフォルダ",
    modified: "2017-01-01 10:00",
    owner: "user01",
    is_dir: true,
    dir_id: 0,
    is_display: true,
    is_star: false
  }
];

export default FILES;
