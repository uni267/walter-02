import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

const api = new API();

function* watchFetchAnalysis() {
  while (true) {
    const task = yield take(actions.requestFetchAnalysis().type);
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
