import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveUserEmail,
  initUser,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSaveUserEmail() {
  while (true) {
    const task = yield take(saveUserEmail().type);
    console.log(task);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.saveUserEmail, task.user);
      const payload = yield call(API.fetchUser, task.user._id);
      yield put(initUser(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSaveUserEmail;
