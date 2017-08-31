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
import group from "./groupReducer";

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
  group
});

export default fileApp;
