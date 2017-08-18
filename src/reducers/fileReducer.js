const initialState = {
  name: null,
  modified: null,
  is_dir: null,
  dir_id: null,
  is_display: null,
  is_star: null,
  tags: [],
  histories: [],
  authorities: [],
  metaInfo: []
};

const fileReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_FILE":
    return action.file;
  default:
    return state;
  }
};

export default fileReducer;
