import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchFetchRoleMenu() {
  while (true) {
    const task = yield take(actions.requestFetchRoleMenu().type);
    const api = new API();
    yield put(commons.loadingStart());
    try {
      const payload = yield call(api.fetchRoleMenu, task.menu_id);
      yield put(actions.initRoleMenu(payload.data.body));
    }
    catch(e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchRoleMenu;