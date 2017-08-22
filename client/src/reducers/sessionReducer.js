const initialState = {
  login: false,
  message: null,
  errors: {},
  user_id: null
};

const sessionReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "REQUEST_LOGIN_SUCCESS":
    return {
      ...state,
      login: true,
      message: action.message,
      user_id: action.user_id
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
