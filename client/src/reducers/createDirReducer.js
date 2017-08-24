const initialState = {
  open: false,
  errors: {}
};

const createDirReducer = (state = initialState, action) => {

  switch (action.type) {
  case "TOGGLE_CREATE_DIR":
    return {
      ...state,
      open: !state.open,
      errors: {}
    };
  case "CREATE_DIR_ERROR":
    return {
      ...state,
      errors: action.errors
    };
  default:
    return state;
  }
};

export default createDirReducer;
