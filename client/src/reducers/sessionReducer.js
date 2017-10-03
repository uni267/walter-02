import * as actionTypes from "../actionTypes";

const initialState = {
  login: false,
  message: null,
  errors: {},
  user_id: null
};

const sessionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.REQUEST_LOGIN_SUCCESS:
    return {
      ...state,
      login: true,
      message: action.message,
      user_id: action.user_id
    };
  case actionTypes.REQUEST_LOGIN_FAILED:
    return {
      ...state,
      start: false,
      login: false,
      message: action.message,
      errors: action.errors
    };
  case actionTypes.LOGOUT:
    return initialState;
  default:
    return state;
  }
};

export default sessionReducer;
