import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchUser,
  initUser,
  initGroups,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchFetchUser() {
  while (true) {
    const task = yield take(requestFetchUser().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const [user, group] = yield all([
        call(API.fetchUser, task.user_id),
        call(API.fetchGroup, task.tenant_id)
      ]);

      yield put(initUser(user.data.body));
      yield put(initGroups(group.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchFetchUser;
