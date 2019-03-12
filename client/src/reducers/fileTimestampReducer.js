import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  openConfirm: false,
  file: {}
};

const fileTimestampReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.TOGGLE_TIMESTAMP_DIALOG:
    return state.open
      ? initialState
      : { ...state, open: !state.open, file: action.file };
  case actionTypes.TOGGLE_TIMESTAMP_CONFIRM_DIALOG:
    return { ...state, openConfirm: !state.openConfirm };
  case actionTypes.UPDATE_TIMESTAMP_TARGET_FILE:
    return { ...state, file: action.file };
  default:
    return state;
  }
};

export default fileTimestampReducer;
