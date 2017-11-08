import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/index";
import * as commons from "../actions/commons";

function* watchFetchMenus() {
  while (true) {
    yield take(actions.requestFetchAuthorityMenus().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchAuthorityMenus);
      yield put(actions.initAuthorityMenu(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchMenus;
