import { combineReducers } from "redux";
import FILES from "../mock-files";

import moment from "moment";

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
  case "SET_VISIBILITY_FILTER":
    return action.filter;
  default:
    return state;
  }
};

const files = (state = FILES, action) => {
  switch (action.type) {

  case "ADD_FILE":
    let next_file_id = state.slice().sort((a,b) => a.id < b.id)[0].id + 1;
    return [
      ...state,
      {
        id: next_file_id,
        name: action.name,
        modified: moment().format("YYYY-MM-DD HH:mm"),
        owner: "user01",
        is_dir: false,
        dir_id: action.dir_id,
        is_display: true,
        is_star: false
      }
    ];

  case "ADD_DIR":
    let next_dir_id = state.slice().sort((a, b) => a.id < b.id)[0].id + 1;
    return [
      ...state,
      {
        id: next_dir_id,
        name: action.name,
        dir_id: action.dir_id,
        modified: moment().format("YYYY-MM-DD HH:mm"),
        owner: "user01",
        is_dir: true,
        is_display: true,
        is_star: false
      }
    ];

  case "TOGGLE_STAR":
    return state.map(file => {
      if (file.id === action.file_id) {
        return {...file, is_star: !file.is_star};
      } else {
        return file;
      }
    });

  case "DELETE_FILE":
    return state.filter(file => file.id !== action.file.id);

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

  default:
    return state;
  }
};

const initial_app_menu = {
  open: false
};

const app_menu = (state = initial_app_menu, action) => {
  switch (action.type) {
  case "TOGGLE_MENU":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

const account = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ACCOUNT":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

const initial_snackbar = {
  open: false,
  message: "initialize",
  duration: 3000
};

const snackbar = (state = initial_snackbar, action) => {
  switch (action.type) {
  case "TRIGGER_SNACK":
    return {
      open: true,
      message: action.message
    };
  case "CLOSE_SNACK":
    return {
      open: false,
      message: "closed"
    };
  default:
  return state;
  }
};

const searchFile = (state = {value: ''}, action) => {
  switch (action.type) {
  case "SEARCH_FILE":
    return {
      value: action.value
    };
  default:
    return state;
  }
};

const add_dir = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ADD_DIR":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

const add_file = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ADD_FILE":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

const filesBuffer = (state = [], action) => {
  switch (action.type) {
  case "PUSH_FILE_TO_BUFFER":
    return [
      ...state,
      {
        name: action.name,
        dir_id: action.dir_id,
        modified: moment().format("YYYY-MM-DD HH:mm"),
        owner: "user01",
        is_dir: false,
        is_display: true
      }
    ];
  default:
    return state;
  }
};

const fileSortTarget = (state = { sorted: null, desc: false }, action) => {
  switch (action.type) {
  case "SET_SORT_TARGET":
    return {
      sorted: action.sorted,
      desc: !state.desc
    };
  case "TOGGLE_SORT_TARGET":
    return {
      sorted: state.sorted,
      desc: !state.desc
    };
  default:
    return state;
  }
};

const fileApp = combineReducers({
  files,
  app_menu,
  account,
  snackbar,
  visibilityFilter,
  searchFile,
  add_dir,
  add_file,
  filesBuffer,
  fileSortTarget
});

export default fileApp;
