const initialState = {
  data: []
};

const groupsReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_GROUPS":
    return {
      ...state,
      data: action.groups
    };
  default:
    return state;
  }
};

export default groupsReducer;
