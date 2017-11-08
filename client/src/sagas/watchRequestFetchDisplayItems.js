import { put, take, call } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchRequestFetchDisplayItems() {

  while (true) {
    yield take(actions.requestFetchDisplayItems().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchDisplayItems);
      yield put(actions.initDisplayItems(payload.data.body));
      yield put(commons.loadingEnd());
    }
    catch (e) {
    }
  }
}

export default watchRequestFetchDisplayItems;
