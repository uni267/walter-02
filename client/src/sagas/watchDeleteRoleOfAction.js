import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  deleteRoleOfAction,
  loadingStart,
  loadingEnd,
  initRole
} from "../actions";

function* watchDeleteRoleOfAction() {
  while (true) {
    const task = yield take(deleteRoleOfAction().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.deleteRoleOfAction, task.role_id, task.action_id);
      const payload = yield call(API.fetchRole, task.role_id);
      yield put(initRole(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchDeleteRoleOfAction;
