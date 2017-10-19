import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

function* watchChangePassword() {

  while (true) {
    const { current_password, new_password } = yield take("REQUEST_CHANGE_PASSWORD");
    const api = new API();

    try {
      yield put({ type: "LOADING_START" });

      yield call(api.changePassword, current_password, new_password);
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
