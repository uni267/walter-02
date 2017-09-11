import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchActions,
  initActions,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchFetchActions() {
  while (true) {
    yield take(requestFetchActions().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchActions);
      yield put(initActions(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchActions;
