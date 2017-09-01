const initialState = {
  data: {
    name: "",
    email: "",
    password: "",
    enabled: false,
    groups: []
  }
};

const userReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_USER":
    console.log("(reducer) init user ");
    return {
      ...state,
      data: action.user
    };
  case "CHANGE_USER_NAME":
    return {
      ...state,
      data: {
        ...state.data,
        name: action.name
      }
    };
  default:
    return state;
  }
};

export default userReducer;
