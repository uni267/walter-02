const addFileReducer = (state = { open: false }, action) => {
  switch (action.type) {
  case "TOGGLE_ADD_FILE":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

export default addFileReducer;
