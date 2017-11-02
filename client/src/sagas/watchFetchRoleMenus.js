import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchFetchRoleMenus() {
  while (true) {
    yield take(actions.requestFetchRoleMenus().type);
    const api = new API();
    yield put(commons.loadingStart());
    try {
      const payload = yield call(api.fetchRoleMenus);
      yield put(actions.initRoleMenus(payload.data.body));
    }
    catch(e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchRoleMenus;