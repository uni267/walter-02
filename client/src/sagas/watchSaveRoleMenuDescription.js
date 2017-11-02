import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/menus";
import * as commons from "../actions/commons";

function* watchSaveRoleMenuDescription() {
  while (true) {
    const task = yield take(actions.saveRoleMenuDescription().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield put(actions.clearRoleMenuValidationError());

    try {
      yield call(api.saveRoleMenuDescription, task.roleMenu);
      const payload = yield call(api.fetchRoleMenu, task.roleMenu._id);
      yield put(actions.initRoleMenu(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("備考を変更しました"));
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleMenuValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveRoleMenuDescription;
