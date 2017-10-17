import * as actionTypes from "../actionTypes";

export const moveFile = (dir, file) => ({
  type: actionTypes.MOVE_FILE, dir, file
});

export const moveFiles = (dir, files) => ({
  type: actionTypes.MOVE_FILES, dir, files
});

export const copyFile = (dir_id, file) => ({
  type: actionTypes.COPY_FILE, dir_id, file
});

export const deleteFile = (file) => ({
  type: actionTypes.DELETE_FILE, file
});

export const deleteDirTree = (dir) => ({
  type: actionTypes.DELETE_DIR_TREE, dir
});

export const editFileByIndex = (file) => ({
  type: actionTypes.EDIT_FILE_BY_INDEX, file
});

export const toggleStar = (file) => ({
  type: actionTypes.TOGGLE_STAR, file
});

export const addAuthorityToFile = (file, user, role) => ({
  type: actionTypes.ADD_AUTHORITY_TO_FILE, file, user, role
});

export const deleteAuthorityToFile = (file_id, authority_id) => ({
  type: actionTypes.DELETE_AUTHORITY, file_id, authority_id
});

export const setSortTarget = (sorted) => ({
  type: actionTypes.SET_SORT_TARGET, sorted
});

export const toggleSortTarget = () => ({
  type: actionTypes.TOGGLE_SORT_TARGET
});

export const sortFile = (dir_id) => ({
  type: actionTypes.SORT_FILE, dir_id
});

export const requestFetchFiles = (
  dir_id, page = 0, sorted = null, desc = null
) => ({
  type: actionTypes.REQUEST_FETCH_FILES, dir_id, page, sorted, desc
});

export const uploadFiles = (dir_id, files) => ({
  type: actionTypes.UPLOAD_FILES, dir_id, files
});

export const toggleDeleteFileDialog = (file) => ({
  type: actionTypes.TOGGLE_DELETE_FILE_DIALOG, file
});

export const toggleMoveDirDialog = (dir) => ({
  type: actionTypes.TOGGLE_MOVE_DIR_DIALOG, dir
});

export const requestFetchMetaInfos = () => ({
  type: actionTypes.REQUEST_FETCH_META_INFOS
});

export const addMetaInfoToFile = (file, metaInfo, value) => ({
  type: actionTypes.ADD_META_INFO_TO_FILE, file, metaInfo, value
});

export const deleteMetaInfoToFile = (file, metaInfo) => ({
  type: actionTypes.DELETE_META_INFO_TO_FILE, file, metaInfo
});

export const toggleFileMetaInfoDialog = (file) => ({
  type: actionTypes.TOGGLE_FILE_META_INFO_DIALOG, file
});

export const toggleFileCheck = (file) => ({
  type: actionTypes.TOGGLE_FILE_CHECK, file
});

export const toggleFileCheckAll = (value) => ({
  type: actionTypes.TOGGLE_FILE_CHECK_ALL, value
});

export const fileNextPage = () => ({
  type: actionTypes.FILE_NEXT_PAGE
});

export const downloadFile = (file) => ({
  type: actionTypes.DOWNLOAD_FILE, file
});

export const requestFetchRoles = () => ({
  type: actionTypes.REQUEST_FETCH_ROLES
});

export const requestFetchUsers = () => ({
  type: actionTypes.REQUEST_FETCH_USERS
});

export const toggleAuthorityFileDialog = (file) => ({
  type: actionTypes.TOGGLE_AUTHORITY_FILE_DIALOG, file
});

export const toggleCopyDirDialog = () => ({
  type: actionTypes.TOGGLE_COPY_DIR_DIALOG
});

export const toggleDeleteDirDialog = (dir) => ({
  type: actionTypes.TOGGLE_DELETE_DIR_DIALOG, dir
});

export const toggleAuthorityDirDialog = (dir) => ({
  type: actionTypes.TOGGLE_AUTHORITY_DIR_DIALOG, dir
});

export const toggleMoveFileDialog = (file) => ({
  type: actionTypes.TOGGLE_MOVE_FILE_DIALOG, file
});

export const toggleCopyFileDialog = (file) => ({
  type: actionTypes.TOGGLE_COPY_FILE_DIALOG, file
});

export const toggleHistoryFileDialog = (file) => ({
  type: actionTypes.TOGGLE_HISTORY_FILE_DIALOG, file
});

export const toggleFileTagDialog = (file) => ({
  type: actionTypes.TOGGLE_FILE_TAG_DIALOG, file
});

export const triggerSnackbar = (message) => ({
  type: actionTypes.TRIGGER_SNACK, message
});

export const initFileTotal = (total) => ({
  type: actionTypes.INIT_FILE_TOTAL, total
});

export const initFiles = (files) => ({
  type: actionTypes.INIT_FILES, files
});

export const fetchSearchFileSimple = (
  value, page = 0, sorted = null, desc = null
) => ({
  type: actionTypes.FETCH_SEARCH_FILE_SIMPLE, value, page, sorted, desc
});

export const initFilePagination = () => ({
  type: actionTypes.INIT_FILE_PAGINATION
});
