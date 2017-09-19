import { combineReducers } from "redux";

// reducers
import files from "./filesReducer";
import file from "./fileReducer";
import dirs from "./dirsReducer";
import snackbar from "./snackbarReducer";
import addDir from "./addDirReducer";
import addFile from "./addFileReducer";
import notifications from "./notificationsReducer";
import filesBuffer from "./filesBufferReducer";
import fileSortTarget from "./fileSortTargetReducer";
import users from "./usersReducer";
import roles from "./rolesReducer";
import selectedDir from "./selectedDirReducer";
import session from "./sessionReducer";
import loading from "./loadingReducer";
import tenant from "./tenantReducer";
import tags from "./tagsReducer";
import changePassword from "./changePasswordReducer";
import createDir from "./createDirReducer";
import fileUpload from "./fileUploadReducer";
import deleteFile from "./deleteFileReducer";
import dirTree from "./dirTreeReducer";
import metaInfo from "./metaInfoReducer";
import user from "./userReducer";
import groups from "./groupsReducer";
import group from "./groupReducer";
import role from "./roleReducer";
import actions from "./actionsReducer";
import fileDetailSearch from "./fileDetailSearchReducer";
import tag from "./tagReducer";
import moveFilesState from "./moveFilesReducer";
import analysis from "./analysisReducer";

const fileApp = combineReducers({
  files,
  file,
  dirs,
  snackbar,
  addDir,
  addFile,
  filesBuffer,
  fileSortTarget,
  notifications,
  users,
  roles,
  selectedDir,
  session,
  loading,
  tenant,
  tags,
  changePassword,
  createDir,
  fileUpload,
  deleteFile,
  dirTree,
  metaInfo,
  user,
  groups,
  group,
  role,
  actions,
  fileDetailSearch,
  tag,
  moveFilesState,
  analysis
});

export default fileApp;
