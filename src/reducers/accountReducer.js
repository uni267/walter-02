const accountReducer = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ACCOUNT":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

export default accountReducer;
