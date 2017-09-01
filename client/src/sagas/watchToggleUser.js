import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  toggleUser,
  initUser,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchToggleUser() {
  while (true) {
    const task = yield take(toggleUser().type);
    console.log("watch toggle user");

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.toggleUser, task.user_id);
      const payload = yield call(API.fetchUser, task.user_id);
      yield put(initUser(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchToggleUser;
