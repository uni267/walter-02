const addDirReducer = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ADD_DIR":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

export default addDirReducer;
