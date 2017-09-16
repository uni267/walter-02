import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchDeleteRole() {
  while (true) {
    const task = yield take(actions.deleteRole().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.deleteRole, task.role);
      const payload = yield call(API.fetchRoles, localStorage.getItem("tenantId"));
      yield put(actions.initRoles(payload.data.body));
      yield task.history.push("/roles");
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("ロールを削除しました"));
    }
    catch (e) {
      console.log(e);
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDeleteRole;
