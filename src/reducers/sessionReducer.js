const initialState = {
  start: false,
  login: false,
  message: null,
  errors: {}
};

const sessionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "REQUEST_LOGIN_START":
    return {...state, start: true};
  case "REQUEST_LOGIN_SUCCESS":
    return {
      ...state,
      start: false,
      login: true,
      message: action.message
    };
  case "REQUEST_LOGIN_FAILED":
    return {
      ...state,
      start: false,
      login: false,
      message: action.message,
      errors: action.errors
    };
  default:
    return state;
  }
};

export default sessionReducer;
