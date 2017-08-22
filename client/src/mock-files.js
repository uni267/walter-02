const FILES = [
  {
    id: 0,
    name: "Top",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
    is_display: false,
    authorities: []
  },
  {
    id: 1,
    name: "契約書2017-01-20.pdf",
    modified: "2017-01-20 9:30",
    is_dir: false,
    dir_id: 0,
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
    ],
    metaInfo: [
      {id: 1, key: "契約書No", value: 201606010001}
    ]
  },
  {
    id: 2,
    name: "宿泊領収書2017-02-01.pdf",
    modified: "2017-02-01 10:30",
    is_dir: false,
    dir_id: 0,
    is_display: true,
    is_star: false,
    tags: [],
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
      {id: 1, key: "領収書No", value: "201606010001"},
      {id: 3, key: "金額", value: "10,000"}
    ]
  },
  {
    id: 3,
    name: "領収書2017-02-03.pdf",
    modified: "2017-02-03 14:00",
    is_dir: false,
    dir_id: 0,
    is_display: true,
    is_star: true,
    tags: [],
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
    ],
    metaInfo: [
      {id: 1, key: "領収書No", value: "201606010001"},
      {id: 2, key: "金額", value: "10,000"}
    ]
  },
  {
    id: 4,
    name: "folder1",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
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
  },
  {
    id: 5,
    name: "folder2",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 0,
    is_display: true,
    is_star: false,
    tags: [],
    histories: [
      {
        id: 1,
        user: { name: "user01" },
        action: "新規作成",
        modified: "2016-12-01 10:00",
        body: "新: folder2"
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
  },
  {
    id: 6,
    name: "folder1-1",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 4,
    is_display: true,
    is_star: false,
    tags: [],
    histories: [
      {
        id: 1,
        user: { name: "user01" },
        action: "新規作成",
        modified: "2016-12-01 10:00",
        body: "新: folder1-1"
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
  },
  {
    id: 7,
    name: "folder1-1-1",
    modified: "2017-01-01 10:00",
    is_dir: true,
    dir_id: 6,
    is_display: true,
    is_star: false,
    tags: [],
    histories: [
      {
        id: 1,
        user: { name: "user01" },
        action: "新規作成",
        modified: "2016-12-01 10:00",
        body: "新: folder1-1-1"
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
  },
  {
    id: 9999,
    name: "ごみ箱",
    modified: "0000-00-00 00:00",
    is_dir: true,
    dir_id: 0,
    is_diplay: false,
    is_star: false,
    tags: [],
    histories: [
      {
        id: 1,
        user: { name: "user01" },
        action: "新規作成",
        modified: "2016-12-01 10:00",
        body: "新: folder1-1-1"
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
      },
    ]
  }
];

export default FILES;