import { delay } from "redux-saga";
import { call, put, take }  from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchAddRoleOfAction() {
  while (true) {
    const task = yield take(actions.addRoleOfAction().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.addRoleOfAction, task.role_id, task.action_id);
      const payload = yield call(api.fetchRole, task.role_id);
      yield put(actions.initRole(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("ロールにアクションを追加しました"));
    }
    catch (e) {
      console.log(e);
      yield put(actions.loadingEnd());
    }
  }
}

export default watchAddRoleOfAction;
