const initialState = {
  data: {
    enabled: true,
    name: "",
    email: "",
    password: "",
    groups: []
  },
  changed: {
    name: "",
    email: "",
    password: ""
  },
  errors: {}
};

const userReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_USER":
    return {
      ...state,
      data: { ...action.user, password: "" },
      changed: { ...action.user, password: "" }
    };
  case "CHANGE_USER_NAME":
    return {
      ...state,
      changed: { ...state.changed, name: action.name }
    };
  case "CHANGE_USER_PASSWORD":
    return {
      ...state,
      changed: { ...state.changed, password: action.password }
    };
  case "CHANGE_USER_EMAIL":
    return {
      ...state,
      changed: { ...state.changed, email: action.email }
    };
  case "INIT_NEW_USER_TEMPLATE":
    return {
      ...state,
      changed: {
        enabled: true,
        name: "",
        email: "",
        password: "",
        groups: []
      }
    };
  case "CHANGE_USER_VALIDATION_ERROR":
    return {
      ...state,
      errors: action.errors
    };
  case "CLEAR_USER_VALIDATION_ERROR":
    return {
      ...state,
      errors: {}
    };
  default:
    return state;
  }
};

export default userReducer;
