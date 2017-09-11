import { delay } from "redux-saga";
import { call, put, take }  from "redux-saga/effects";

import { API } from "../apis";

import {
  addRoleOfAction,
  initRole,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchAddRoleOfAction() {
  while (true) {
    const task = yield take(addRoleOfAction().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.addRoleOfAction, task.role_id, task.action_id);
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

export default watchAddRoleOfAction;
