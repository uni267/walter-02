const initialState = {
  data: []
};

const groupReducer = (state = initialState, action) => {
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

export default groupReducer;
