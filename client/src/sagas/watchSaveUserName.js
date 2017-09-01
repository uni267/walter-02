import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveUserName,
  initUser,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSaveUserName() {
  while (true) {
    const task = yield take(saveUserName().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.saveUserName, task.user);
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

export default watchSaveUserName;
