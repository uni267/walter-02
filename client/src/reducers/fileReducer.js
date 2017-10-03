import * as actionTypes from "../actionTypes";

const initialState = {
  tags: []
};

const fileReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_FILE:
    return action.file;
  default:
    return state;
  }
};

export default fileReducer;
