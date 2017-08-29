const fileReducer = (state = {}, action) => {
  switch ( action.type ) {
  case "INIT_FILE":
    return action.file;
  default:
    return state;
  }
};

export default fileReducer;
