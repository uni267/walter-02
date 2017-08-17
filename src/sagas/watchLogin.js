import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { login, fetchUserById } from "../apis";

// action
import { requestLoginSuccess, putTenant } from "../actions";

function* watchLogin() {
  while (true) {
    const task = yield take("REQUEST_LOGIN");
    yield put({ type: "LOADING_START" });

    try {
      const resLogin = yield call(login, task.name, task.password);
      const resUser = yield call(fetchUserById, resLogin.data.body.user_id);

      localStorage.setItem("dirId", resUser.data.body.tenant.home_dir_id);
      localStorage.setItem("tenantName", resUser.data.body.tenant.name);

      localStorage.setItem("token", resLogin.data.token);
      localStorage.setItem("userId", resLogin.data.body.user_id);

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

export default watchLogin;
