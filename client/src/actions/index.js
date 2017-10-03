import * as actionTypes from "../actionTypes";

export const toggleAddDir = () => ({
  type: actionTypes.TOGGLE_ADD_DIR
});

export const createDir = (dir_id, dir_name) => ({
  type: actionTypes.CREATE_DIR, dir_id, dir_name
});

export const triggerSnackbar = (message) => ({
  type: actionTypes.TRIGGER_SNACK, message
});

export const closeSnackbar = () => ({
  type: actionTypes.CLOSE_SNACK
});

export const toggleAddFile = () => ({
  type: actionTypes.TOGGLE_ADD_FILE
});

export const pushFileToBuffer = (file) => ({
  type: actionTypes.PUSH_FILE_TO_BUFFER, file
});

export const clearFilesBuffer = () => ({
  type: actionTypes.CLEAR_FILES_BUFFER
});

export const searchFileSimple = (value) => ({
  type: actionTypes.SEARCH_FILE_SIMPLE, value
});

export const setSortTarget = (sorted) => ({
  type: actionTypes.SET_SORT_TARGET, sorted
});

export const toggleSortTarget = () => ({
  type: actionTypes.TOGGLE_SORT_TARGET
});

export const sortFile = (sorted, desc) => ({
  type: actionTypes.SORT_FILE, sorted, desc
});

export const moveFile = (dir, file) => ({
  type: actionTypes.MOVE_FILE, dir, file
});

export const deleteFile = (file) => ({
  type: actionTypes.DELETE_FILE, file
});

export const editFileByView = (file) => ({
  type: actionTypes.EDIT_FILE_BY_VIEW, file
});

export const editFileByIndex = (file) => ({
  type: actionTypes.EDIT_FILE_BY_INDEX, file
});

export const toggleStar = (file) => ({
  type: actionTypes.TOGGLE_STAR, file
});

export const notifications = () => ({
  type: actionTypes.TOGGLE_NOTIFICATIONS
});

export const addAuthorityToFile = (file, user, role) => ({
  type: actionTypes.ADD_AUTHORITY_TO_FILE, file, user, role
});

export const deleteAuthorityToFile = (file_id, authority_id) => ({
  type: actionTypes.DELETE_AUTHORITY, file_id, authority_id
});

export const deleteDirTree = (dir) => ({
  type: actionTypes.DELETE_DIR_TREE, dir
});

export const addTag = (file_id, tag) => ({
  type: actionTypes.ADD_TAG, file_id, tag
});

export const selectDirTree = (dir) => ({
  type: actionTypes.SELECT_DIR_TREE, dir
});

export const copyFile = (dir_id, file) => ({
  type: actionTypes.COPY_FILE, dir_id, file
});

export const addMetaInfo = (file, metaInfo, value) => ({
  type: actionTypes.ADD_META_INFO, file, metaInfo, value
});

export const deleteMetaInfo = (file, metaInfo) => ({
  type: actionTypes.DELETE_META_INFO, file, metaInfo
});

export const requestLogin = (name, password) => ({
  type: actionTypes.REQUEST_LOGIN, name, password
});

export const requestLoginSuccess = (message, user_id) => ({
  type: actionTypes.REQUEST_LOGIN_SUCCESS,  message,  user_id
});

export const requestLoginFailed = (message, errors) => ({
  type: actionTypes.REQUEST_LOGIN_FAILED, message, errors
});

export const putTenant = (tenant_id, name, dirId, trashDirId) => ({
  type: actionTypes.PUT_TENANT, tenant_id, name, dirId, trashDirId
});

export const requestFetchFiles = (dir_id, page) => ({
  type: actionTypes.REQUEST_FETCH_FILES, dir_id, page
});

export const requestFetchNextFiles = (dir_id, page) => ({
  type: actionTypes.REQUEST_FETCH_NEXT_FILES, dir_id, page
});

export const requestFetchFile = (file_id) => ({
  type: actionTypes.REQUEST_FETCH_FILE, file_id
});

export const requestFetchTags = () => ({
  type: actionTypes.REQUEST_FETCH_TAGS
});

export const requestAddTag = (file, tag) => ({
  type: actionTypes.REQUEST_ADD_TAG, file, tag
});

export const requestDelTag = (file, tag) => ({
  type: actionTypes.REQUEST_DEL_TAG, file, tag
});

export const requestChangePassword = (current_password, new_password) => ({
  type: actionTypes.REQUEST_CHANGE_PASSWORD, current_password, new_password
});

export const loadingStart = () => ({
  type: actionTypes.LOADING_START
});

export const loadingEnd = () => ({
  type: actionTypes.LOADING_END
});

export const toggleChangePasswordDialog = () => ({
  type: actionTypes.TOGGLE_CHANGE_PASSWORD_DIALOG
});

export const logout = () => ({
  type: actionTypes.LOGOUT
});

export const toggleCreateDir = () => ({
  type: actionTypes.TOGGLE_CREATE_DIR
});

export const fileUpload = (dir_id, file) => ({
  type: actionTypes.FILE_UPLOAD, dir_id, file
});

export const uploadFiles = (dir_id, files) => ({
  type: actionTypes.UPLOAD_FILES, dir_id, files
});
  
export const toggleDeleteFileDialog = (file) => ({
  type: actionTypes.TOGGLE_DELETE_FILE_DIALOG, file
});

export const requestFetchDirTree = (root_id) => ({
  type: actionTypes.REQUEST_FETCH_DIR_TREE, root_id
});

export const moveDir = (destinationDir, movingDir) => ({
  type: actionTypes.MOVE_DIR, destinationDir, movingDir
});

export const toggleMoveDirDialog = (dir) => ({
  type: actionTypes.TOGGLE_MOVE_DIR_DIALOG, dir
});

export const requestFetchMetaInfo = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_META_INFO, tenant_id
});

export const initMetaInfo = (meta_infos) => ({
  type: actionTypes.INIT_META_INFO, meta_infos
});

export const initFile = (file) => ({
  type: actionTypes.INIT_FILE, file
});

export const initFiles = (files) => ({
  type: actionTypes.INIT_FILES, files
});

export const initNextFiles = (files) => ({
  type: actionTypes.INIT_NEXT_FILES, files
});

export const initDir = (dirs) => ({
  type: actionTypes.INIT_DIR, dirs
});

export const toggleMetaInfoDialog = (target_file) => ({
  type: actionTypes.TOGGLE_META_INFO_DIALOG, target_file
});

export const updateMetaInfoTarget = (target_file) => ({
  type: actionTypes.UPDATE_META_INFO_TARGET, target_file
});

export const requestFetchUsers = () => ({
  type: actionTypes.REQUEST_FETCH_USERS
});

export const requestFetchUser = (user_id, tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_USER, user_id, tenant_id
});

export const initUsers = (users) => ({
  type: actionTypes.INIT_USERS, users
});

export const initUser = (user) => ({
  type: actionTypes.INIT_USER, user
});

export const initGroups = (groups) => ({
  type: actionTypes.INIT_GROUPS, groups
});

export const initGroup = (group) => ({
  type: actionTypes.INIT_GROUP, group
});

export const deleteGroupOfUser = (user_id, group_id) => ({
  type: actionTypes.DELETE_GROUP_OF_USER, user_id, group_id
});

export const addGroupOfUser = (user_id, group_id) => ({
  type: actionTypes.ADD_GROUP_OF_USER, user_id, group_id
});

export const toggleUser = (user_id) => ({
  type: actionTypes.TOGGLE_USER, user_id
});

export const changeUserName = (name) => ({
  type: actionTypes.CHANGE_USER_NAME, name
});

export const changeUserValidationError = (errors) => ({
  type: actionTypes.CHANGE_USER_VALIDATION_ERROR, errors
});

export const clearUserValidationError = () => ({
  type: actionTypes.CLEAR_USER_VALIDATION_ERROR
});

export const changeUserEmail = (email) => ({
  type: actionTypes.CHANGE_USER_EMAIL, email
});

export const changeUserPassword = (password) => ({
  type: actionTypes.CHANGE_USER_PASSWORD, password
});

export const saveUserName = (user) => ({
  type: actionTypes.SAVE_USER_NAME, user
});

export const saveUserEmail = (user) => ({
  type: actionTypes.SAVE_USER_EMAIL, user
});

export const saveUserPassword = (user) => ({
  type: actionTypes.SAVE_USER_PASSWORD, user
});

export const saveUserPasswordForce = (user) => ({
  type: actionTypes.SAVE_USER_PASSWORD_FORCE, user
});

export const searchUsersSimple = (tenant_id, keyword) => ({
  type: actionTypes.SEARCH_USERS, tenant_id, keyword
});

export const requestFetchGroups = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_GROUPS, tenant_id
});

export const requestFetchGroup = (group_id) => ({
  type: actionTypes.REQUEST_FETCH_GROUP, group_id
});

export const changeGroupName = (name) => ({
  type: actionTypes.CHANGE_GROUP_NAME, name
});

export const changeGroupDescription = (description) => ({
  type: actionTypes.CHANGE_GROUP_DESCRIPTION, description
});

export const saveGroupName = (group) => ({
  type: actionTypes.SAVE_GROUP_NAME, group
});

export const saveGroupDescription = (group) => ({
  type: actionTypes.SAVE_GROUP_DESCRIPTION, group
});

export const saveGroupValidationError = (errors) => ({
  type: actionTypes.SAVE_GROUP_VALIDATION_ERROR, errors
});

export const clearGroupValidationError = () => ({
  type: actionTypes.CLEAR_GROUP_VALIDATION_ERROR
});

export const initNewUserTemplate = () => ({
  type: actionTypes.INIT_NEW_USER_TEMPLATE
});

export const createUser = (user, history) => ({
  type: actionTypes.CREATE_USER, user, history
});

export const createGroup = (group, history) => ({
  type: actionTypes.CREATE_GROUP, group, history
});

export const deleteGroup = (group_id, history) => ({
  type: actionTypes.DELETE_GROUP, group_id, history
});

export const requestFetchRoles = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_ROLES, tenant_id
});

export const initRoles = (roles) => ({
  type: actionTypes.INIT_ROLES, roles
});

export const initRole = (role) => ({
  type: actionTypes.INIT_ROLE, role
});

export const requestFetchRole = (role_id) => ({
  type: actionTypes.REQUEST_FETCH_ROLE, role_id
});

export const changeRoleName = (name) => ({
  type: actionTypes.CHANGE_ROLE_NAME, name
});

export const changeRoleDescription = (description) => ({
  type: actionTypes.CHANGE_ROLE_DESCRIPTION, description
});

export const saveRoleName = (role) => ({
  type: actionTypes.SAVE_ROLE_NAME, role
});

export const saveRoleDescription = (role) => ({
  type: actionTypes.SAVE_ROLE_DESCRIPTION, role
});

export const saveRoleValidationError = (errors) => ({
  type: actionTypes.SAVE_ROLE_VALIDATION_ERROR, errors
});

export const clearRoleValidationError = () => ({
  type: actionTypes.CLEAR_ROLE_VALIDATION_ERROR
});

export const deleteRoleOfAction = (role_id, action_id) => ({
  type: actionTypes.DELETE_ROLE_OF_ACTION, role_id, action_id
});

export const createRole = (role, history) => ({
  type: actionTypes.CREATE_ROLE, role, history
});

export const requestFetchActions = () => ({
  type: actionTypes.REQUEST_FETCH_ACTIONS
});

export const initActions = (actions) => ({
  type: actionTypes.INIT_ACTIONS, actions
});

export const addRoleOfAction = (role_id, action_id) => ({
  type: actionTypes.ADD_ROLE_OF_ACTION, role_id, action_id
});

export const deleteRole = (role, history) => ({
  type: actionTypes.DELETE_ROLE, role, history
});

export const requestFetchFileSearchItems = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_FILE_SEARCH_ITEMS, tenant_id
});

export const initFileDetailSearchItems = (items) => ({
  type: actionTypes.INIT_FILE_DETAIL_SEARCH_ITEMS, items
});

export const toggleFileDetailSearchPopover = () => ({
  type: actionTypes.TOGGLE_FILE_DETAIL_SEARCH_POPOVER
});

export const fileDetailSearchAnchorElement = (event) => ({
  type: actionTypes.FILE_DETAIL_SEARCH_ANCHOR_ELEMENT, event
});

export const searchItemPick = (item) => ({
  type: actionTypes.SEARCH_ITEM_PICK, item
});

export const searchItemNotPick = (item) => ({
  type: actionTypes.SEARCH_ITEM_NOT_PICK, item
});

export const searchValueChange = (item, value) => ({
  type: actionTypes.SEARCH_VALUE_CHANGE, item, value
});

export const searchFileDetail = () => ({
  type: actionTypes.SEARCH_FILE_DETAIL
});

export const initTags = (tags) => ({
  type: actionTypes.INIT_TAGS, tags
});

export const initTag = (tag) => ({
  type: actionTypes.INIT_TAG, tag
});

export const requestFetchTag = (tag_id) => ({
  type: actionTypes.REQUEST_FETCH_TAG, tag_id
});

export const changeTagLabel = (value) => ({
  type: actionTypes.CHANGE_TAG_LABEL, value
});

export const changeTagColor = (value) => ({
  type: actionTypes.CHANGE_TAG_COLOR, value
});

export const changeTagDescription = (value) => ({
  type: actionTypes.CHANGE_TAG_DESCRIPTION, value
});

export const saveTagLabel = (tag) => ({
  type: actionTypes.SAVE_TAG_LABEL, tag
});

export const saveTagColor = (tag) => ({
  type: actionTypes.SAVE_TAG_COLOR, tag
});

export const saveTagDescription = (tag) => ({
  type: actionTypes.SAVE_TAG_DESCRIPTION, tag
});

export const saveTagValidationError = (errors) => ({
  type: actionTypes.SAVE_TAG_VALIDATION_ERROR, errors
});

export const createTag = (tag, history) => ({
  type: actionTypes.CREATE_TAG, tag, history
});

export const deleteTag = (tag_id, history) => ({
  type: actionTypes.DELETE_TAG, tag_id, history
});

export const toggleFileCheck = (file) => ({
  type: actionTypes.TOGGLE_FILE_CHECK, file
});

export const toggleFileCheckAll = (value) => ({
  type: actionTypes.TOGGLE_FILE_CHECK_ALL, value
});

export const deleteFiles = (files) => ({
  type: actionTypes.DELETE_FILES, files
});

export const toggleDeleteFilesDialog = () => ({
  type: actionTypes.TOGGLE_DELETE_FILES_DIALOG
});

export const moveFiles = (dir, files) => ({
  type: actionTypes.MOVE_FILES, dir, files
});

export const toggleMoveFilesDialog = () => ({
  type: actionTypes.TOGGLE_MOVE_FILES_DIALOG
});

export const requestFetchAnalysis = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_ANALYSIS, tenant_id
});

export const initAnalysis = (analysis) => ({
  type: actionTypes.INIT_ANALYSIS, analysis
});

export const initFileTotal = (total) => ({
  type: actionTypes.INIT_FILE_TOTAL, total
});

export const fileNextPage = () => ({
  type: actionTypes.FILE_NEXT_PAGE
});

export const deleteFileBuffer = (file) => ({
  type: actionTypes.DELETE_FILE_BUFFER, file
});

export const popFileToBuffer = (file) => ({
  type: actionTypes.POP_FILE_TO_BUFFER, file
});

export const downloadFile = (file) => ({
  type: actionTypes.DOWNLOAD_FILE, file
});

export const toggleAuthorityFileDialog = (file) => ({
  type: actionTypes.TOGGLE_AUTHORITY_FILE_DIALOG, file
});

export const initAuthorityFileDialog = (file) => ({
  type: actionTypes.INIT_AUTHORITY_FILE_DIALOG, file
});

export const requestVerifyToken = (token) => ({
  type: actionTypes.REQUEST_VERIFY_TOKEN, token
});

export const searchTagSimple = (keyword) => ({
  type: actionTypes.SEARCH_TAG_SIMPLE, keyword
});
