import * as actionTypes from "../actionTypes";

const filesReducer = (state = [], action) => {
  switch ( action.type ) {

  case actionTypes.INIT_FILES:
    return action.files.map( file => ({ ...file, checked: false }));

  case actionTypes.INIT_FILE:
    if (state.length > 0) {
      return state.map( file => file._id === action.file._id ? action.file : file );
    } else {
      return [ action.file ];
    }

  case actionTypes.INIT_NEXT_FILES:
    return state.concat(action.files.map( file => ({ ...file, checked: false })));

  case actionTypes.TOGGLE_FILE_CHECK:
    return state.map( file => {
      return file._id === action.file._id
        ? { ...file, checked: !action.file.checked } : file;
    });

  case actionTypes.TOGGLE_FILE_CHECK_ALL:
    return action.value
      ? state.map( file => ({ ...file, checked: true }) )
      : state.map( file => ({ ...file, checked: false }) );

  case actionTypes.TOGGLE_STAR_SUCCESSFUL:
    return state.map(file => {
      return file._id === action.file._id
        ? { ...file, is_star: !action.file.is_star } : file;
    });

  case actionTypes.CLEAR_FILES:
    return [];

  default:
    return state;
  }
};

export default filesReducer;
