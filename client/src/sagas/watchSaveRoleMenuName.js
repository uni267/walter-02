import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchSaveRoleMenuName() {
  while (true) {
    const task = yield take(actions.saveRoleMenuName().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield put(actions.clearRoleMenuValidationError());

    try {
      yield call(api.saveRoleMenuName, task.menu);
      const payload = yield call(api.fetchRoleMenu, task.menu._id);
      yield put(actions.initRoleMenu(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("表示名を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleMenuValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveRoleMenuName;
