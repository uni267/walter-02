const initialState = {
  start: false,
  login: false,
  error: null,
  user: null
};

const sessionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "REQUEST_LOGIN_START":
    return {...initialState, start: true};
  case "REQUEST_LOGIN_SUCCESS":
    return {
      ...state,
      start: false,
      login: true,
      user: action.user
    };
  case "REQUEST_LOGIN_FAILED":
    return {
      ...state,
      start: false,
      login: false,
      error: action.error
    };
  default:
    return state;
  }
};

export default sessionReducer;
