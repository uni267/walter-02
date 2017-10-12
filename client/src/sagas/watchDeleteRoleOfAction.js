import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/roles";
import * as commons from "../actions/commons";

function* watchDeleteRoleOfAction() {
  while (true) {
    const task = yield take(actions.deleteRoleOfAction().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.deleteRoleOfAction, task.role_id, task.action_id);
      const payload = yield call(api.fetchRole, task.role_id);
      yield put(actions.initRole(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールからアクションを削除しました"));
      yield call(delay, 3000);
      yield put(commons.closeSnackbar());
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteRoleOfAction;
