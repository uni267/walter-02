import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveRoleDescription() {
  while (true) {
    const task = yield take(actions.saveRoleDescription().type);
    const api = new API();
    yield put(actions.loadingStart());
    yield put(actions.clearRoleValidationError());

    try {
      yield call(delay, 1000);
      yield call(api.saveRoleDescription, task.role);
      const payload = yield call(api.fetchRole, task.role._id);
      yield put(actions.initRole(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("ロールの備考を変更しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveRoleDescription;
