import * as actionTypes from "../actionTypes";

const initialState = {
  open: false,
  name: null,
  message: null
};

const exceptionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_EXCEPTION:
    return {
      open: true,
      message: action.message,
      name: action.name
    };
  case actionTypes.CLOSE_EXCEPTION:
    return initialState;
  default:
    return state;
  }
};

export default exceptionReducer;
