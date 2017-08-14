import { combineReducers } from "redux";

// reducers
import files from "./filesReducer";
import dirs from "./dirsReducer";
import snackbar from "./snackbarReducer";
import searchFile from "./searchFileReducer";
import addDir from "./addDirReducer";
import addFile from "./addFileReducer";
import notifications from "./notificationsReducer";
import filesBuffer from "./filesBufferReducer";
import fileSortTarget from "./fileSortTargetReducer";
import users from "./usersReducer";
import roles from "./rolesReducer";
import selectedDir from "./selectedDirReducer";
import session from "./sessionReducer";

const fileApp = combineReducers({
  files,
  dirs,
  snackbar,
  searchFile,
  addDir,
  addFile,
  filesBuffer,
  fileSortTarget,
  notifications,
  users,
  roles,
  selectedDir,
  session
});

export default fileApp;
