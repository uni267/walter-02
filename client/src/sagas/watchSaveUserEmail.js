import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveUserEmail,
  changeUserValidationError,
  clearUserValidationError,
  initUser,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSaveUserEmail() {
  while (true) {
    const task = yield take(saveUserEmail().type);
    yield put(clearUserValidationError());

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.saveUserEmail, task.user);
      const payload = yield call(API.fetchUser, task.user._id);
      yield put(initUser(payload.data.body));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(changeUserValidationError(errors));
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSaveUserEmail;
