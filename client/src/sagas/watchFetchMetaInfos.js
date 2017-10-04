import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import * as actions from "../actions";

import { API } from "../apis";

function* watchFetchMetaInfos() {
  while (true) {
    const task = yield take(actions.requestFetchMetaInfos().type);
    const api = new API();

    yield put(actions.loadingStart());
    yield call(delay, 1000);

    try {
      const payload = yield call(api.fetchMetaInfos);
      yield put(actions.initMetaInfos(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchMetaInfos;
