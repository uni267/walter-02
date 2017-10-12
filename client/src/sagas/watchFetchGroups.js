import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/groups";
import * as commons from "../actions/commons";

function* watchFetchGroups() {
  while (true) {
    const task = yield take(actions.requestFetchGroups().type);
    const api = new API();

    try {
      yield put(commons.loadingStart());
      yield call(delay, 1000);
      const payload = yield call(api.fetchGroup, task.tenant_id);
      yield put(actions.initGroups(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchGroups;

