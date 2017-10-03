import * as actionTypes from "../actionTypes";

const initialState = {
  meta_infos: [],
  target_file: null,
  dialog_open: false
};

const metaInfoReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_META_INFO:
    return {
      ...state,
      meta_infos: action.meta_infos
    };
  case actionTypes.TOGGLE_META_INFO_DIALOG:
    return {
      ...state,
      target_file: action.target_file,
      dialog_open: !state.dialog_open
    };
  case actionTypes.UPDATE_META_INFO_TARGET:
    return {
      ...state,
      target_file: action.target_file
    };
  default:
    return state;
  }
};

export default metaInfoReducer;
