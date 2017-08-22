const initialState = {
  open: false,
  errors: {}
};

const changePasswordReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "TOGGLE_CHANGE_PASSWORD_DIALOG":
    return {
      ...state,
      open: !state.open
    };
  case "CHANGE_PASSWORD_SUCCESS":
    return {
      ...state,
      open: !state.open,
      errors: {}
    };
  case "CHANGE_PASSWORD_FAILED":
    return {
      ...state,
      errors: action.errors
    };
  default:
    return state;
  }
};

export default changePasswordReducer;
