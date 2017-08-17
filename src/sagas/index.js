import { fork } from "redux-saga/effects";

import watchLogin from "./watchLogin";
import watchFetchFiles from "./watchFetchFiles";

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchFetchFiles);
}

export default Saga;
