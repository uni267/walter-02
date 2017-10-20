import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/analysises";
import * as commons from "../actions/commons";

function* watchFetchAnalysis() {
  while (true) {
    const task = yield take(actions.requestFetchAnalysis().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchAnalysis, task.tenant_id);
      yield put(actions.initAnalysis(payload.data.body));
    }      
    catch (e) {

    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchAnalysis;
