const FILES = [
  {
    id: 0,
    name: "Top",
    modified: "2017-01-01 10:00",
    owner: "user01",
    is_dir: true,
    dir_id: 0,
    is_display: false
  },
  {
    id: 1,
    name: "xxx様の仕様書2017_01.doc",
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
        group: {
          id: 1,
          name: "営業部",
          members: [
            {id: 1, name: "user01"},
            {id: 2, name: "user02"}
          ]
        },
        role: {
          read: true,
          modify: true,
          delete: false,
          restore: false,
          authory: false
        }
      },
      {
        group: {
          id: 2,
          name: "情報システム部",
          members: [
            {id: 3, name: "admin01"},
            {id: 4, name: "admin02"}
          ]
        },
        role: {
          read: true,
          modify: true,
          delete: true,
          restore: true,
          authory: true
        }
      }
    ]
  },
  {
    id: 2,
    name: "2017年2月1日領収書.pdf",
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
    ],
    authorities: [
      {
        group: {
          id: 1,
          name: "営業部",
          members: [
            {id: 1, name: "user01"},
            {id: 2, name: "user02"}
          ]
        },
        role: {
          read: true,
          modify: true,
          delete: false,
          restore: false,
          authory: false
        }
      },
      {
        group: {
          id: 2,
          name: "情報システム部",
          members: [
            {id: 3, name: "admin01"},
            {id: 4, name: "admin02"}
          ]
        },
        role: {
          read: true,
          modify: true,
          delete: true,
          restore: true,
          authory: true
        }
      }
    ]
  },
  {
    id: 3,
    name: "2017年2月3日領収書.pdf",
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
    ],
    authorities: [
      {
        group: { id: 1, name: "営業部" },
        role: {
          read: true,
          modify: true,
          delete: false,
          restore: false,
          authory: false
        }
      },
      {
        group: { id: 1, name: "情報システム部" },
        role: {
          read: true,
          modify: true,
          delete: true,
          restore: true,
          authory: true
        }
      }
    ]
  },
  {
    id: 4,
    name: "フォルダ1",
    modified: "2017-01-01 10:00",
    owner: "user01",
    is_dir: true,
    dir_id: 0,
    is_display: true,
    is_star: false
  }
];

export default FILES;
