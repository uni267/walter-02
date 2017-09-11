import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  deleteRole,
  initRoles,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchDeleteRole() {
  while (true) {
    const task = yield take(deleteRole().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.deleteRole, task.role);
      const payload = yield call(API.fetchRoles, localStorage.getItem("tenantId"));
      yield put(initRoles(payload.data.body));
      yield task.history.push("/roles");
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchDeleteRole;
