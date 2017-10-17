import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchToggleUser() {
  while (true) {
    const task = yield take(actions.toggleUser().type);
    const api = new API();

    try {
      yield put(commonActions.loadingStart());
      yield call(delay, 1000);
      yield call(api.toggleUser, task.user_id);
      const payload = yield call(api.fetchUser, task.user_id);
      const user = payload.data.body;
      yield put(actions.initUser(user));
      const message = user.enabled === true
            ? "ユーザを有効に変更しました"
            : "ユーザを無効に変更しました";
      yield put(commonActions.triggerSnackbar(message));
    }
    catch (e) {

    }
    finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchToggleUser;
