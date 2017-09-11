const initialState = [];

const actionsReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_ACTIONS":
    return action.actions;
  default:
    return state;
  }
};

export default actionsReducer;
