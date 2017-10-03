import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchFetchAnalysis() {
  while (true) {
    const task = yield take(actions.requestFetchAnalysis().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchAnalysis, task.tenant_id);
      yield put(actions.initAnalysis(payload.data.body));
    }      
    catch (e) {

    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchAnalysis;
