import { call, put, take }  from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchAddRoleOfMenu() {
  while (true) {
    const task = yield take(actions.addRoleOfMenu().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.addRoleOfMenu, task.role_id, task.menu_id);
      const payload = yield call(api.fetchRoleMenu, task.role_id);
      yield put(actions.initRoleMenu(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールにアクションを追加しました"));
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchAddRoleOfMenu;
