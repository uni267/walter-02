const initialState = {
  data: {
    actions: []
  },
  changed: {
    actions: []
  },
  errors: {}
};

const roleReducer = (state = initialState, action) => {
  switch (action.type) {
  case "INIT_ROLE":
    return {
      ...state,
      data: action.role,
      changed: action.role
    };
  case "CHANGE_ROLE_NAME":
    return {
      ...state,
      changed: {
        ...state.changed,
        name: action.name
      }
    };
  case "CHANGE_ROLE_DESCRIPTION":
    return {
      ...state,
      changed: {
        ...state.changed,
        description: action.description
      }
    };
  case "SAVE_ROLE_VALIDATION_ERROR":
    return {
      ...state,
      errors: action.errors
    };
  case "CLEAR_ROLE_VALIDATION_ERROR":
    return {
      ...state,
      errors: {}
    };
  default:
    return state;
  }
};

export default roleReducer;
