import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// action
import {
  loadingEnd,
  loadingStart,
  requestLogin,
  requestLoginSuccess,
  requestLoginFailed,
  putTenant
} from "../actions";

function* watchLogin() {
  while (true) {
    const task = yield take(requestLogin().type);
    yield put(loadingStart());

    try {
      yield call(delay, 500);
      const resLogin = yield call(API.login, task.name, task.password);
      const resUser = yield call(API.fetchUserById, resLogin.data.body.user_id);

      localStorage.setItem("dirId", resUser.data.body.tenant.home_dir_id);
      localStorage.setItem("trashDirId", resUser.data.body.tenant.trash_dir_id);
      localStorage.setItem("tenantName", resUser.data.body.tenant.name);
      localStorage.setItem("tenantId", resUser.data.body.tenant._id);
      localStorage.setItem("token", resLogin.data.token);
      localStorage.setItem("userId", resLogin.data.body.user_id);

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
