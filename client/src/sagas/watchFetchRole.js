import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchRole,
  initRole,
  loadingStart,
  loadingEnd
} from "../actions";

const api = new API();

function* watchFetchRole() {
  while (true) {
    const task = yield take(requestFetchRole().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchRole, task.role_id);
      yield put(initRole(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchRole;
