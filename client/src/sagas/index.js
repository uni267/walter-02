import { fork } from "redux-saga/effects";

import watchLogin from "./watchLogin";
import watchLogout from "./watchLogout";
import watchFetchFiles from "./watchFetchFiles";
import watchFetchFile from "./watchFetchFile";
import watchFetchTags from "./watchFetchTags";
import watchAddTag from "./watchAddTag";
import watchDelTag from "./watchDelTag";
import watchEditFileByView from "./watchEditFileByView";
import watchEditFileByIndex from "./watchEditFileByIndex";
import watchChangePassword from "./watchChangePassword";
import watchCreateDir from "./watchCreateDir";
import watchDeleteFile from "./watchDeleteFile";
import watchUploadFiles from "./watchUploadFiles";
import watchMoveFile from "./watchMoveFile";
import watchSearchFileSimple from "./watchSearchFileSimple";
import watchFetchDirTree from "./watchFetchDirTree";
import watchMoveDir from "./watchMoveDir";
import watchFetchMetaInfo from "./watchFetchMetaInfo";
import watchAddMetaInfo from "./watchAddMetaInfo";
import watchDeleteMetaInfo from "./watchDeleteMetaInfo";
import watchFetchUsers from "./watchFetchUsers";
import watchFetchUser from "./watchFetchUser";
import watchDeleteGroupOfUser from "./watchDeleteGroupOfUser";
import watchAddGroupOfUser from "./watchAddGroupOfUser";
import watchToggleUser from "./watchToggleUser";

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchFetchFiles);
  yield fork(watchFetchFile);
  yield fork(watchFetchTags);
  yield fork(watchAddTag);
  yield fork(watchDelTag);
  yield fork(watchEditFileByView);
  yield fork(watchEditFileByIndex);
  yield fork(watchChangePassword);
  yield fork(watchCreateDir);
  yield fork(watchDeleteFile);
  yield fork(watchUploadFiles);
  yield fork(watchMoveFile);
  yield fork(watchSearchFileSimple);
  yield fork(watchFetchDirTree);
  yield fork(watchMoveDir);
  yield fork(watchFetchMetaInfo);
  yield fork(watchAddMetaInfo);
  yield fork(watchDeleteMetaInfo);
  yield fork(watchFetchUsers);
  yield fork(watchFetchUser);
  yield fork(watchDeleteGroupOfUser);
  yield fork(watchAddGroupOfUser);
  yield fork(watchToggleUser);
}

export default Saga;
