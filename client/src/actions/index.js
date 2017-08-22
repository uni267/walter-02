export const toggleAddDir = () => ({
  type: "TOGGLE_ADD_DIR"
});

export const createDir = (dir_id, dir_name) => ({
  type: "CREATE_DIR",
  dir_id, dir_name
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

export const editFileByView = (file) => ({
  type: "EDIT_FILE_BY_VIEW",
  file
});

export const editFileByIndex = (file) => ({
  type: "EDIT_FILE_BY_INDEX",
  file
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

export const addMetaInfo = (file, metaInfo) => ({
  type: "ADD_META_INFO",
  file,
  metaInfo
});

export const deleteMetaInfo = (file, metaInfo) => ({
  type: "DELETE_META_INFO",
  file,
  metaInfo
});

export const requestLogin = (name, password) => ({
  type: "REQUEST_LOGIN",
  name: name,
  password: password
});

export const requestLoginSuccess = (message, user_id) => ({
  type: "REQUEST_LOGIN_SUCCESS",
  message,
  user_id
});

export const putTenant = (name, dirId) => ({
  type: "PUT_TENANT",
  name,
  dirId
});

export const requestHomeDir = (user_id) => ({
  type: "REQUEST_HOME_DIR",
  user_id
});

export const requestFetchFiles = (dir_id) => ({
  type: "REQUEST_FETCH_FILES",
  dir_id
});

export const requestFetchFile = (file_id) => ({
  type: "REQUEST_FETCH_FILE",
  file_id
});

export const requestFetchTags = () => ({
  type: "REQUEST_FETCH_TAGS"
});

export const requestAddTag = (file, tag) => ({
  type: "REQUEST_ADD_TAG",
  file, tag
});

export const requestDelTag = (file, tag) => ({
  type: "REQUEST_DEL_TAG",
  file, tag
});

export const requestChangePassword = (current_password, new_password) => ({
  type: "REQUEST_CHANGE_PASSWORD",
  current_password, new_password
});

export const loadingEnd = () => ({
  type: "LOADING_END"
});

export const toggleChangePasswordDialog = () => ({
  type: "TOGGLE_CHANGE_PASSWORD_DIALOG"
});

export const logout = () => ({
  type: "LOGOUT"
});

export const toggleCreateDir = () => ({
  type: "TOGGLE_CREATE_DIR"
});

