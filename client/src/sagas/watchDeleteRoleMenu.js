import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";


function* watchDeleteRoleMenu() {
  while (true) {
    const task = yield take(actions.deleteRoleMenu().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.deleteRoleMenu, task.roleMenu);
      const payload = yield call(api.fetchRoleMenus);
      yield put(actions.initRoleMenus(payload.data.body));
      yield task.history.push("/role_menus");
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールを削除しました"));
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteRoleMenu;
