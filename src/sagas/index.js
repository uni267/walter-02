import { delay } from "redux-saga";
import { call, put, fork, take, cancel, race, select } from "redux-saga/effects";

// api
import { login, getUsers } from "../apis";

function* watchLogin() {
  while (true) {
    const task = yield take("REQUEST_LOGIN");
    yield put({ type: "REQUEST_LOGIN_START" });

    // @todo ログインテスト用
    yield call(delay, 1000);

    try {
      const result = yield call(login, task.name, task.password);
      const { token } = result.data;
      localStorage.setItem("token", token);

      yield put({ type: "REQUEST_LOGIN_SUCCESS" });
    }
    catch (e) {
      yield put({ type: "REQUEST_LOGIN_FAILED", error: e });
    }

    try {
      const users = yield call(getUsers);
      console.log(users);
    }
    catch (e) {
      console.log(e);
    }

  }
}

function* Saga() {
  yield fork(watchLogin);
}

export default Saga;
