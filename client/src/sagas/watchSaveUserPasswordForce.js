import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveUserPasswordForce() {
  while (true) {
    const task = yield take(actions.saveUserPasswordForce().type);
    yield put(actions.clearUserValidationError());

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(API.saveUserPasswordForce, task.user);
      const payload = yield call(API.fetchUser, task.user._id);
      yield put(actions.initUser(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("パスワードを変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.changeUserValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveUserPasswordForce;
