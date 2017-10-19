import { call, put, take }  from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/roles";
import * as commons from "../actions/commons";

function* watchAddRoleOfAction() {
  while (true) {
    const task = yield take(actions.addRoleOfAction().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.addRoleOfAction, task.role_id, task.action_id);
      const payload = yield call(api.fetchRole, task.role_id);
      yield put(actions.initRole(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールにアクションを追加しました"));
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchAddRoleOfAction;
