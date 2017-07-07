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

export const closeSnackbar = () => ({
  type: "CLOSE_SNACK"
});

export const toggleAddFile = () => ({
  type: "TOGGLE_ADD_FILE"
});

export const pushFileToBuffer = (dir_id, name) => ({
  type: "PUSH_FILE_TO_BUFFER",
  dir_id: Number(dir_id),
  name: name
});

export const addFile = (dir_id, name) => ({
  type: "ADD_FILE",
  dir_id: Number(dir_id),
  name: name
});

export const searchFile = (keyword) => ({
  type: "SEARCH_FILE",
  value: keyword
});

export const setSortTarget = (target) => ({
  type: "SET_SORT_TARGET",
  sorted: target
});

export const toggleSortTarget = () => ({
  type: "TOGGLE_SORT_TARGET"
});

export const sortFile = (sorted, desc) => ({
  type: "SORT_FILE",
  sorted: sorted,
  desc: desc
});

