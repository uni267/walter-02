import FILES from "../mock-files";
import moment from "moment";

const filesReducer = (state = FILES, action) => {
  switch ( action.type ) {

  case "ADD_FILE":
    let next_file_id = state.slice().sort((a,b) => b.id - a.id)[0].id + 1;

    return [
      ...state,
      {
        id: next_file_id,
        name: action.name,
        modified: moment().format("YYYY-MM-DD HH:mm"),
        is_dir: false,
        dir_id: action.dir_id,
        is_display: true,
        is_star: false,
        tags: [],
        histories: [
          {
            id: 1,
            user: { name: "user01" },
            action: "新規作成",
            modified: moment().format("YYYY-MM-DD HH:mm"),
            body: `新ファイル名は${action.name}`
          }
        ],
        authorities: [
          {
            id: 1,
            user: {
              id: 1,
              type: "user",
              name: "user01",
              name_jp: "ユーザ太郎",
              is_owner: true
            },
            role: {
              id: 3,
              name: "フルコントロール",
              actions: ["read", "write", "authority"]
            }
          }
        ]
      }
    ];

  case "ADD_DIR":
    const next_dir_id = state.slice().sort((a, b) => b.id - a.id)[0].id + 1;

    return [
      ...state,
      {
        id: next_dir_id,
        name: action.name,
        dir_id: Number(action.dir_id),
        modified: moment().format("YYYY-MM-DD HH:mm"),
        is_dir: true,
        is_display: true,
        is_star: false,
        histories: [
          {
            id: 1,
            user: { name: "user01" },
            action: "新規作成",
            modified: moment().format("YYYY-MM-DD HH:mm"),
            body: `新ファイル名は${action.name}`
          }
        ],
        authorities: [
          {
            id: 1,
            user: {
              id: 1,
              type: "user",
              name: "user01",
              name_jp: "ユーザ太郎",
              is_owner: true
            },
            role: {
              id: 3,
              name: "フルコントロール",
              actions: ["read", "write", "authority"]
            }
          }
        ]

      }
    ];

  case "DELETE_FILE":
    return state.map(file => {
      if (file.id === action.file.id) {
        file.dir_id = 9999;
        return file;
      }
      return file;
    });

  case "EDIT_FILE":
    return state.map(file => {
      return file.id === action.file.id ?
        {...file, name: action.file.name} : file;
    });

  case "SORT_FILE":
    let _state = state.slice();

    _state.sort( (a, b) => {
      if (action.desc) {
        return a[action.sorted] > b[action.sorted];
      } else {
        return a[action.sorted] < b[action.sorted];
      }
    });

    return _state;
    
  case "MOVE_FILE":
    return state.map(file => {
      if (file.id === action.file_id) {
        file.dir_id = action.dir_id;
      }
      return file;
    });

  case "TOGGLE_STAR":
    return state.map(file => {
      if (file.id === action.file_id) {
        return {...file, is_star: !file.is_star};
      } else {
        return file;
      }
    });

  case "ADD_AUTHORITY":
    return state.map(file => {
      if (file.id === action.file_id) {

        const next_authority_id = file.authorities.slice()
              .sort( (a, b) => a.id < b.id)[0].id + 1;

        const addAuthority = {
          id: next_authority_id,
          user: { ...action.user, is_owner: false },
          role: action.role
        };

        return {
          ...file,
          authorities: [...file.authorities, addAuthority]
        };

      }

      return file;
    });

  case "DELETE_AUTHORITY":
    return state.map(file => {
      if (Number(file.id) === Number(action.file_id)) {
        const authorities = file.authorities
              .filter(auth => Number(auth.id) !== Number(action.authority_id));

        return {...file, authorities};
      }
      return file;
    });

  case "DELETE_TAG":
    return state.map(file => {
      if (file.id === action.file_id) {
        const tags = file.tags.slice().filter( tag => tag.id !== action.tag.id );
        return {...file, tags};
      }

      return file;
    });

  case "ADD_TAG":
    return state.map(file => {
      if (file.id === action.file_id) {
        const tags = [...file.tags.slice(), action.tag];
        return {...file, tags};
      }

      return file;
    });

  case "COPY_FILE":
    const nextFileId = state.slice().sort((a,b) => b.id - a.id)[0].id + 1;

    let file = {...action.file, dir_id: action.dir_id};
    file = {...file, id: nextFileId};
    return [...state, file];
  default:
    return state;
  }

};

export default filesReducer;
