const initial_snackbar = {
  open: false,
  message: "initialize",
  duration: 3000
};

const snackbarReducer = (state = initial_snackbar, action) => {
  switch (action.type) {
  case "TRIGGER_SNACK":
    return {
      open: true,
      message: action.message
    };
  case "CLOSE_SNACK":
    return {
      open: false,
      message: "closed"
    };
  default:
  return state;
  }
};

export default snackbarReducer;
