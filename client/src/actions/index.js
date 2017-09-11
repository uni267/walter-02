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
  dir_id, name
});

export const clearFilesBuffer = () => ({
  type: "CLEAR_FILES_BUFFER"
});

export const searchFileSimple = (value) => ({
  type: "SEARCH_FILE_SIMPLE", value
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

export const moveFile = (dir, file) => ({
  type: "MOVE_FILE", dir, file
});

export const deleteFile = (file) => ({
  type: "DELETE_FILE", file
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

export const addMetaInfo = (file, metaInfo, value) => ({
  type: "ADD_META_INFO", file, metaInfo, value
});

export const deleteMetaInfo = (file, metaInfo) => ({
  type: "DELETE_META_INFO", file, metaInfo
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

export const requestLoginFailed = (message, errors) => ({
  type: "REQUEST_LOGIN_FAILED", message, errors
});

export const putTenant = (tenant_id, name, dirId, trashDirId) => ({
  type: "PUT_TENANT", tenant_id, name, dirId, trashDirId
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

export const loadingStart = () => ({
  type: "LOADING_START"
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

export const fileUpload = (dir_id, file) => ({
  type: "FILE_UPLOAD", dir_id, file
});

export const uploadFiles = (dir_id, files) => ({
  type: "UPLOAD_FILES", dir_id, files
});
  
export const toggleDeleteFileDialog = (file) => ({
  type: "TOGGLE_DELETE_FILE_DIALOG", file
});

export const requestFetchDirTree = (root_id) => ({
  type: "REQUEST_FETCH_DIR_TREE", root_id
});

export const moveDir = (destinationDir, movingDir) => ({
  type: "MOVE_DIR", destinationDir, movingDir
});

export const toggleMoveDirDialog = (dir) => ({
  type: "TOGGLE_MOVE_DIR_DIALOG", dir
});

export const requestFetchMetaInfo = (tenant_id) => ({
  type: "REQUEST_FETCH_META_INFO", tenant_id
});

export const initMetaInfo = (meta_infos) => ({
  type: "INIT_META_INFO", meta_infos
});

export const initFile = (file) => ({
  type: "INIT_FILE", file
});

export const initFiles = (files) => ({
  type: "INIT_FILES", files
});

export const initDir = (dirs) => ({
  type: "INIT_DIR", dirs
});

export const toggleMetaInfoDialog = (target_file) => ({
  type: "TOGGLE_META_INFO_DIALOG", target_file
});

export const updateMetaInfoTarget = (target_file) => ({
  type: "UPDATE_META_INFO_TARGET", target_file
});

export const requestFetchUsers = (tenant_id) => ({
  type: "REQUEST_FETCH_USERS", tenant_id
});

export const requestFetchUser = (user_id, tenant_id) => ({
  type: "REQUEST_FETCH_USER", user_id, tenant_id
});

export const initUsers = (users) => ({
  type: "INIT_USERS", users
});

export const initUser = (user) => ({
  type: "INIT_USER", user
});

export const initGroups = (groups) => ({
  type: "INIT_GROUPS", groups
});

export const initGroup = (group) => ({
  type: "INIT_GROUP", group
});

export const deleteGroupOfUser = (user_id, group_id) => ({
  type: "DELETE_GROUP_OF_USER", user_id, group_id
});

export const addGroupOfUser = (user_id, group_id) => ({
  type: "ADD_GROUP_OF_USER", user_id, group_id
});

export const toggleUser = (user_id) => ({
  type: "TOGGLE_USER", user_id
});

export const changeUserName = (name) => ({
  type: "CHANGE_USER_NAME", name
});

export const changeUserValidationError = (errors) => ({
  type: "CHANGE_USER_VALIDATION_ERROR", errors
});

export const clearUserValidationError = () => ({
  type: "CLEAR_USER_VALIDATION_ERROR" 
});

export const changeUserEmail = (email) => ({
  type: "CHANGE_USER_EMAIL", email
});

export const changeUserPassword = (password) => ({
  type: "CHANGE_USER_PASSWORD", password
});

export const saveUserName = (user) => ({
  type: "SAVE_USER_NAME", user
});

export const saveUserEmail = (user) => ({
  type: "SAVE_USER_EMAIL", user
});

export const saveUserPassword = (user) => ({
  type: "SAVE_USER_PASSWORD", user
});

export const saveUserPasswordForce = (user) => ({
  type: "SAVE_USER_PASSWORD_FORCE", user
});

export const searchUsersSimple = (tenant_id, keyword) => ({
  type: "SEARCH_USERS", tenant_id, keyword
});

export const requestFetchGroups = (tenant_id) => ({
  type: "REQUEST_FETCH_GROUPS", tenant_id
});

export const requestFetchGroup = (group_id) => ({
  type: "REQUEST_FETCH_GROUP", group_id
});

export const changeGroupName = (name) => ({
  type: "CHANGE_GROUP_NAME", name
});

export const changeGroupDescription = (description) => ({
  type: "CHANGE_GROUP_DESCRIPTION", description
});

export const saveGroupName = (group) => ({
  type: "SAVE_GROUP_NAME", group
});

export const saveGroupDescription = (group) => ({
  type: "SAVE_GROUP_DESCRIPTION", group
});

export const saveGroupValidationError = (errors) => ({
  type: "SAVE_GROUP_VALIDATION_ERROR", errors
});

export const clearGroupValidationError = () => ({
  type: "CLEAR_GROUP_VALIDATION_ERROR"
});

export const initNewUserTemplate = () => ({
  type: "INIT_NEW_USER_TEMPLATE"
});

export const createUser = (user, history) => ({
  type: "CREATE_USER", user, history
});

export const createGroup = (group, history) => ({
  type: "CREATE_GROUP", group, history
});

export const deleteGroup = (group_id, history) => ({
  type: "DELETE_GROUP", group_id, history
});

export const requestFetchRoles = (tenant_id) => ({
  type: "REQUEST_FETCH_ROLES", tenant_id
});

export const initRoles = (roles) => ({
  type: "INIT_ROLES", roles
});

export const initRole = (role) => ({
  type: "INIT_ROLE", role
});

export const requestFetchRole = (role_id) => ({
  type: "REQUEST_FETCH_ROLE", role_id
});

export const changeRoleName = (name) => ({
  type: "CHANGE_ROLE_NAME", name
});

export const changeRoleDescription = (description) => ({
  type: "CHANGE_ROLE_DESCRIPTION", description
});

export const saveRoleName = (role) => ({
  type: "SAVE_ROLE_NAME", role
});

export const saveRoleDescription = (role) => ({
  type: "SAVE_ROLE_DESCRIPTION", role
});

export const saveRoleValidationError = (errors) => ({
  type: "SAVE_ROLE_VALIDATION_ERROR", errors
});

export const clearRoleValidationError = () => ({
  type: "CLEAR_ROLE_VALIDATION_ERROR"
});

export const deleteRoleOfAction = (role_id, action_id) => ({
  type: "DELETE_ROLE_OF_ACTION", role_id, action_id
});

export const createRole = (role, history) => ({
  type: "CREATE_ROLE", role, history
});
