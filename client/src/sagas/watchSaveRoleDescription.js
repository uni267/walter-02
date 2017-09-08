import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveRoleDescription,
  saveRoleValidationError,
  clearRoleValidationError,
  initRole,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSaveRoleDescription() {
  while (true) {
    const task = yield take(saveRoleDescription().type);
    yield put(loadingStart());
    yield put(clearRoleValidationError());

    try {
      yield call(delay, 1000);
      yield call(API.saveRoleDescription, task.role);
      const payload = yield call(API.fetchRole, task.role._id);
      yield put(initRole(payload.data.body));
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(saveRoleValidationError(errors));
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSaveRoleDescription;
