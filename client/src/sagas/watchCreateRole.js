import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  createRole,
  loadingStart,
  loadingEnd,
  initRoles,
  saveRoleValidationError,
  clearRoleValidationError
} from "../actions";

function* watchCreateRole() {
  while (true) {
    const task = yield take(createRole().type);
    yield put(clearRoleValidationError());

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.createRole, task.role);
      const payload = yield call(API.fetchRoles, localStorage.getItem("tenantId"));
      yield put(initRoles(payload.data.body));
      yield put(loadingEnd());
      yield call(task.history.push("/roles"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(saveRoleValidationError(errors));
      yield put(loadingEnd());
    }
  }
}

export default watchCreateRole;
