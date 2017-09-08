import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

function* watchChangePassword() {

  while (true) {
    const { current_password, new_password } = yield take("REQUEST_CHANGE_PASSWORD");

    try {
      yield put({ type: "LOADING_START" });
      yield call(delay, 1000);

      yield call(API.changePassword, current_password, new_password);
      yield put({ type: "CHANGE_PASSWORD_SUCCESS" });
      yield put({ type: "TRIGGER_SNACK", message: "パスワードを変更しました" });
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put({ type: "CHANGE_PASSWORD_FAILED", errors });
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }

}

export default watchChangePassword;
