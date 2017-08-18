import { fork } from "redux-saga/effects";

import watchLogin from "./watchLogin";
import watchFetchFiles from "./watchFetchFiles";
import watchFetchFile from "./watchFetchFile";

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchFetchFiles);
  yield fork(watchFetchFile);
}

export default Saga;
