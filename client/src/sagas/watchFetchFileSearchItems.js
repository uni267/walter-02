import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchFileSearchItems,
  initFileDetailSearchItems,
  loadingStart,
  loadingEnd
} from "../actions";

const api = new API();

function* watchFetchFileSearchItems() {
  while (true) {
    const task = yield take(requestFetchFileSearchItems().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchFileSearchItems);
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
