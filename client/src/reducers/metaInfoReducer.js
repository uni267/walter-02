const initialState = {
  meta_infos: [],
  target_file_id: null,
  dialog_open: false
};

const metaInfoReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_META_INFO":
    return {
      ...state,
      meta_infos: action.meta_infos
    };
  case "TOGGLE_META_INFO_DIALOG":
    console.log("fire");
    return {
      ...state,
      dialog_open: !state.dialog_open
    };
  default:
    return state;
  }
};

export default metaInfoReducer;
