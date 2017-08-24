const initialState = {
  open: false,
  file: {}
};

const deleteFileReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "TOGGLE_DELETE_FILE_DIALOG":
    return {
      ...state,
      file: action.file,
      open: !state.open
    };
  default:
    return state;
  }
};

export default deleteFileReducer;
