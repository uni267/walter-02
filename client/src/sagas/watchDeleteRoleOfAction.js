import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchDeleteRoleOfAction() {
  while (true) {
    const task = yield take(actions.deleteRoleOfAction().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.deleteRoleOfAction, task.role_id, task.action_id);
      const payload = yield call(API.fetchRole, task.role_id);
      yield put(actions.initRole(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("ロールからアクションを削除しました"));
    }
    catch (e) {
      console.log(e);
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDeleteRoleOfAction;
