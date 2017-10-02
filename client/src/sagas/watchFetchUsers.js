import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  initUsers,
  requestFetchUsers,
  loadingStart,
  loadingEnd
} from "../actions";

const api = new API();

function* watchFetchUsers() {
  while (true) {
    const task = yield take(requestFetchUsers().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchUsers);
      yield put(initUsers(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchFetchUsers;
