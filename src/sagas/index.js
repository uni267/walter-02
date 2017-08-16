import { delay } from "redux-saga";
import { call, put, fork, take } from "redux-saga/effects";

// api
import { login, fetchUserById } from "../apis";

function* watchLogin() {
  while (true) {
    const task = yield take("REQUEST_LOGIN");
    yield put({ type: "LOADING_START" });

    try {
      // @todo テスト完了後に削除する
      yield call(delay, 1500);

      const result = yield call(login, task.name, task.password);
      const { token } = result.data;
      localStorage.setItem("token", token);

      const message = result.data.status.message;

      const user = yield call(fetchUserById, result.data.body.user_id);
      const { home_dir_id, name } = user.data.body.tenant;

      yield put({
        type: "PUT_TENANT",
        name: name,
        dirId: home_dir_id
      });

      yield put({
        type: "REQUEST_LOGIN_SUCCESS",
        message: message,
        user_id: result.data.body.user_id
      });

      yield put({ type: "LOADING_END" });
    }
    catch (e) {
      console.log(e.response.data);
      const message = e.response.data.status.message;
      const errors = e.response.data.status.errors;

      yield put({
        type: "REQUEST_LOGIN_FAILED",
        message: message,
        errors: errors
      });

      yield put({ type: "LOADING_END" });
    }

  }
}

function* Saga() {
  yield fork(watchLogin);
}

export default Saga;
