import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  file: {}
};

const restoreFileReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.TOGGLE_RESTORE_FILE_DIALOG:
    return {
      ...state,
      open: !state.open
    };
  default:
    return state;
  }
};

export default restoreFileReducer;
