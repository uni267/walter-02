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
        modified: action.modified,
        owner: action.owner,
        is_dir: action.is_dir,
        dir_id: action.dir_id,
        is_display: action.is_display
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
        is_display: true
      }
    ];

  case "DELETE_FILE":
    return state.filter(file => file.id !== action.file.id);

  case "SORT_FILE":
    const { sort } = action;

    let _state = state.slice();

    _state.sort( (a, b) => {
      if (sort.desc) {
        return a[sort.sorted] > b[sort.sorted];
      } else {
        return a[sort.sorted] < b[sort.sorted];
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

const search = (state = {value: ''}, action) => {
  switch (action.type) {
  case "SEARCH":
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

const fileApp = combineReducers({
  files,
  app_menu,
  account,
  snackbar,
  visibilityFilter,
  search,
  add_dir
});

export default fileApp;
