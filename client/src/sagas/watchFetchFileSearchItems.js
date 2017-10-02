import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchFileSearchItems,
  initFileDetailSearchItems,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchFetchFileSearchItems() {
  while (true) {
    const task = yield take(requestFetchFileSearchItems().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchFileSearchItems);
      yield put(initFileDetailSearchItems(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchFileSearchItems;
