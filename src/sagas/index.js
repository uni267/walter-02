import { delay } from "redux-saga";
import { call, put, fork, take, cancel, race, select } from "redux-saga/effects";

// api
import { login } from "../apis";

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

      const message = result.data.status.message;

      yield put({
        type: "REQUEST_LOGIN_SUCCESS",
        message: message,
        user_id: result.data.body.user_id
      });
    }
    catch (e) {
      const message = e.response.data.status.message;
      const errors = e.response.data.status.errors;

      yield put({
        type: "REQUEST_LOGIN_FAILED",
        message: message,
        errors: errors
      });
    }

  }
}

function* Saga() {
  yield fork(watchLogin);
}

export default Saga;
