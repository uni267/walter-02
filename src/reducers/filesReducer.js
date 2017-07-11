import FILES from "../mock-files";
import moment from "moment";

const filesReducer = (state = FILES, action) => {
  switch ( action.type ) {

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

export default filesReducer;
