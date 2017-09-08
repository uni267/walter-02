const initialState = {
  data: []
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
  case "INIT_ROLES":
    return {
      ...state,
      data: action.roles
    };
  default:
    return state;
  }
};

export default rolesReducer;
