const initialState = {
  data: {
    groups: []
  }
};

const userReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_USER":
    return {
      ...state,
      data: action.user
    };
  default:
    return state;
  }
};

export default userReducer;
