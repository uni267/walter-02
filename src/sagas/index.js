import { delay } from "redux-saga";
import { call, put, fork, take, cancel, race, select } from "redux-saga/effects";

// api
import { loginAPI } from "../apis";

function* watchLogin() {
  while (true) {
    const task = yield take("REQUEST_LOGIN");
    yield put({ type: "REQUEST_LOGIN_START" });

    yield call(delay, 1000);

    try {
      const result = yield call(loginAPI, task.name, task.password);
      const user = result.data.data.user;
      yield put({ type: "REQUEST_LOGIN_SUCCESS", user });
    }
    catch (e) {
      yield put({ type: "REQUEST_LOGIN_FAILED", error: e });
    }

  }
}

function* Saga() {
  yield fork(watchLogin);
}

export default Saga;
