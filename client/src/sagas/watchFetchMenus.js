import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchFetchMenus() {
  while (true) {
    yield take(actions.requestFetchMenus().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchMenus);
      yield put(actions.initMenus(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchMenus;
