import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchRoles,
  initRoles,
  loadingStart,
  loadingEnd,
} from "../actions";

function* watchFetchRoles() {
  while (true) {
    const task = yield take(requestFetchRoles().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchRoles, task.tenant_id);
      yield put(initRoles(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchRoles;
