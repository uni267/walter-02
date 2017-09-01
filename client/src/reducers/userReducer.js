const initialState = {
  data: {
    name: "",
    email: "",
    password: "",
    enabled: false,
    groups: []
  },
  changed: {
    name: "",
    email: "",
    password: ""
  }
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
  default:
    return state;
  }
};

export default userReducer;
