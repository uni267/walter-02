import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import {
  requestFetchMetaInfo,
  loadingStart,
  loadingEnd,
  initMetaInfo
} from "../actions";

import { API } from "../apis";

function* watchFetchMetaInfo() {
  while (true) {
    const task = yield take(requestFetchMetaInfo().type);
    yield put(loadingStart());
    yield call(delay, 1000);

    try {
      const payload = yield call(API.fetchMetaInfos);
      yield put(initMetaInfo(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchMetaInfo;
