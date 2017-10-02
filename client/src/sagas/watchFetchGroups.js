import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchGroups,
  loadingStart,
  loadingEnd,
  initGroups
} from "../actions";

const api = new API();

function* watchFetchGroups() {
  while (true) {
    const task = yield take(requestFetchGroups().type);

    try {
      yield put(loadingStart());      
      yield call(delay, 1000);
      const payload = yield call(api.fetchGroup, task.tenant_id);
      yield put(initGroups(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchGroups;

