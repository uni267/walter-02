import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";

function* watchFetchFileSearchItems() {
  while (true) {
    yield take(actions.requestFetchFileSearchItems().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchFileSearchItems);
      yield put(actions.initFileDetailSearchItems(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchFileSearchItems;
