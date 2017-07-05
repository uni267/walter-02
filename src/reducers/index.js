import { combineReducers } from "redux";
import FILES from "../mock-files";

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

const fileApp = combineReducers({files, visibilityFilter});
export default fileApp;
