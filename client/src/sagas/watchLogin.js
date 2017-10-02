import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// action
import * as actions from "../actions";

function* watchLogin() {
  while (true) {
    const task = yield take(actions.requestLogin().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 500);
      const payload = yield call(API.login, task.name, task.password);
      const { user, token } = payload.data.body;
      localStorage.setItem("token", token);
      const { _id, name, home_dir_id, trash_dir_id } = user.tenant;
      yield put(actions.putTenant(_id, name, home_dir_id, trash_dir_id));
      yield put(actions.requestLoginSuccess("success", user._id));
    }
    catch (e) {
      const { message, errors } = e.response.data.status;
      yield put(actions.requestLoginFailed(message, errors));
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchLogin;
