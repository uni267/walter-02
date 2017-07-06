export const toggleAccount = () => ({
  type: "TOGGLE_ACCOUNT"
});

export const toggleMenu = () => ({
  type: "TOGGLE_MENU"
});

export const toggleAddDir = () => ({
  type: "TOGGLE_ADD_DIR"
});

export const createDir = (dir_id, dir_name) => ({
  type: "ADD_DIR",
  dir_id: dir_id,
  name: dir_name
});

export const triggerSnackbar = (message) => ({
  type: "TRIGGER_SNACK",
  message: message
});
