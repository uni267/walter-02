const initial_app_menu = {
  open: false
};

const appMenuReducer = (state = initial_app_menu, action) => {
  switch (action.type) {
  case "TOGGLE_MENU":
    return {
      open: !state.open
    };
  default:
    return state;
  }
};

export default appMenuReducer;
