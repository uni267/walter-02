import { fork } from "redux-saga/effects";

import watchLogin from "./watchLogin";
import watchFetchFiles from "./watchFetchFiles";
import watchFetchFile from "./watchFetchFile";
import watchFetchTags from "./watchFetchTags";
import watchAddTag from "./watchAddTag";
import watchDelTag from "./watchDelTag";
import watchEditFileByView from "./watchEditFileByView";
import watchEditFileByIndex from "./watchEditFileByIndex";
import watchChangePassword from "./watchChangePassword";
import watchCreateDir from "./watchCreateDir";
import watchFileUpload from "./watchFileUpload";
import watchDeleteFile from "./watchDeleteFile";
import watchUploadFiles from "./watchUploadFiles";

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchFetchFiles);
  yield fork(watchFetchFile);
  yield fork(watchFetchTags);
  yield fork(watchAddTag);
  yield fork(watchDelTag);
  yield fork(watchEditFileByView);
  yield fork(watchEditFileByIndex);
  yield fork(watchChangePassword);
  yield fork(watchCreateDir);
  yield fork(watchFileUpload);
  yield fork(watchDeleteFile);
  yield fork(watchUploadFiles);
}

export default Saga;
