import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  message: ""
};

const exceptionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_EXCEPTION:
    return {
      open: true,
      message: action.message
    };
  case actionTypes.CLOSE_EXCEPTION:
    return initialState;
  default:
    return state;
  }
};

export default exceptionReducer;
