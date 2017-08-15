import { delay } from "redux-saga";
import { call, put, fork, take, cancel, race, select } from "redux-saga/effects";

// api
import { login, fetchFiles } from "../apis";

function* watchLogin() {
  while (true) {
    const task = yield take("REQUEST_LOGIN");
    yield put({ type: "LOADING_START" });

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

      yield put({ type: "LOADING_END" });
    }
    catch (e) {
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

function* watchFileFetch() {
  while (true) {
    const task = yield take("REQUEST_FETCH_FILES");
    yield put({ type: "REQUEST_FETCH_FILES_START" });

    try {
      
      yield put({ type: "REQUEST_FETCH_FILES_FINISH" });
    }
    catch (e) {
      
    }

  }
}

function* watchHomeDir() {
  while (true) {
    const task = yield take("REQUEST_HOME_DIR");
    yield put({ type: "REQUEST_HOME_DIR_START" });

    try {
      yield call(delay, 3000);
      yield put({ type: "REQUEST_HOME_DIR_FINISH" });
    }
    catch (e) {
    }
  }
}

function* Saga() {
  yield fork(watchLogin);
  yield fork(watchHomeDir);
  yield fork(watchFileFetch);
}

export default Saga;
