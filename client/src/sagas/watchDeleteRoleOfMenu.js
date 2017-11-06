import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchDeleteRoleOfAction() {
  while (true) {
    const task = yield take(actions.deleteRoleOfMenu().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.deleteRoleOfMenu, task.role_id, task.menu_id);
      const payload = yield call(api.fetchRoleMenu, task.role_id);
      yield put(actions.initRoleMenu(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールからメニューを削除しました"));
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteRoleOfAction;
