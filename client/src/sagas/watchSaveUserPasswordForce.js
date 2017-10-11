import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchSaveUserPasswordForce() {
  while (true) {
    const task = yield take(actions.saveUserPasswordForce().type);
    const api = new API();
    yield put(actions.clearUserValidationError());

    try {
      yield put(commonActions.loadingStart());
      yield call(delay, 1000);
      yield call(api.saveUserPasswordForce, task.user);
      const payload = yield call(api.fetchUser, task.user._id);
      yield put(actions.initUser(payload.data.body));
      yield put(commonActions.loadingEnd());
      yield put(commonActions.triggerSnackbar("パスワードを変更しました"));
      yield call(delay, 3000);
      yield put(commonActions.closeSnackbar());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.changeUserValidationError(errors));
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchSaveUserPasswordForce;
