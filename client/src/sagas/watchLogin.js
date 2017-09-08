import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// action
import {
  loadingEnd,
  loadingStart,
  requestLogin,
  requestLoginFailed
} from "../actions";

function* watchLogin() {
  while (true) {
    const task = yield take(requestLogin().type);
    yield put(loadingStart());

    try {
      yield call(delay, 500);
      const payload = yield call(API.login, task.name, task.password);
      const { user, token } = payload.data.body;

      localStorage.setItem("dirId", user.tenant.home_dir_id);
      localStorage.setItem("trashDirId", user.tenant.trash_dir_id);
      localStorage.setItem("tenantName", user.tenant.name);
      localStorage.setItem("tenantId", user.tenant._id);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

    }
    catch (e) {
      const message = e.response.data.status.message;
      const errors = e.response.data.status.errors;
      yield put(requestLoginFailed(message, errors));
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchLogin;
