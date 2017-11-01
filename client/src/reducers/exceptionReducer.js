import * as actionTypes from "../actionTypes";

const initialState = {
  open: true,
  message: "foofoo"
};

const exceptionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.OPEN_EXCEPTION:
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
