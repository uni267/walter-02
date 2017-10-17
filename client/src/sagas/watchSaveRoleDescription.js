import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/roles";
import * as commons from "../actions/commons";

function* watchSaveRoleDescription() {
  while (true) {
    const task = yield take(actions.saveRoleDescription().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield put(actions.clearRoleValidationError());

    try {
      yield call(delay, 1000);
      yield call(api.saveRoleDescription, task.role);
      const payload = yield call(api.fetchRole, task.role._id);
      yield put(actions.initRole(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロールの備考を変更しました"));
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveRoleDescription;
