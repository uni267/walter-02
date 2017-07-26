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
  dir_id,
  name: dir_name
});

export const triggerSnackbar = (message) => ({
  type: "TRIGGER_SNACK",
  message
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
  name
});

export const clearFilesBuffer = () => ({
  type: "CLEAR_FILES_BUFFER"
});

export const addFile = (dir_id, name) => ({
  type: "ADD_FILE",
  dir_id: Number(dir_id),
  name
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
  sorted,
  desc
});

export const moveFile = (dir_id, file_id) => ({
  type: "MOVE_FILE",
  dir_id,
  file_id
});

export const deleteFile = (file) => ({
  type: "DELETE_FILE",
  file: file
});

export const editFile = (file) => ({
  type: "EDIT_FILE",
  file: file
});

export const toggleStar = (file) => ({
  type: "TOGGLE_STAR",
  file_id: Number(file.id)
});

export const notifications = () => ({
  type: "SHOW_ALL"
});

export const addAuthority = (file_id, user, role) => ({
  type: "ADD_AUTHORITY",
  file_id,
  user,
  role
});

export const deleteAuthority = (file_id, authority_id) => ({
  type: "DELETE_AUTHORITY",
  file_id,
  authority_id
});

export const dirRoute = (dir) => ({
  type: "DIR_TREE"
});

export const createDirTree = (parent, dir) => ({
  type: "ADD_DIR_TREE",
  parent,
  dir
});

export const deleteDirTree = (dir) => ({
  type: "DELETE_DIR_TREE",
  dir
});

export const deleteTag = (file_id, tag) => ({
  type: "DELETE_TAG",
  file_id,
  tag
});

export const addTag = (file_id, tag) => ({
  type: "ADD_TAG",
  file_id,
  tag
});

export const selectDirTree = (dir) => ({
  type: "SELECT_DIR_TREE",
  dir
});

export const copyFile = (dir_id, file) => ({
  type: "COPY_FILE",
  dir_id,
  file
});
