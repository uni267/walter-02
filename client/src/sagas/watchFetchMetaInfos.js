import { call, put, take } from "redux-saga/effects";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";

function* watchFetchMetaInfos() {
  while (true) {
    yield take(actions.requestFetchMetaInfos().type);
    const api = new API();

    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchMetaInfos);
      yield put(actions.initMetaInfos(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchMetaInfos;
