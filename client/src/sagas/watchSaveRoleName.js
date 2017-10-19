import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/roles";
import * as commons from "../actions/commons";

function* watchSaveRoleName() {
  while (true) {
    const task = yield take(actions.saveRoleName().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield put(actions.clearRoleValidationError());
    
    try {
      yield call(api.saveRoleName, task.role);
      const payload = yield call(api.fetchRole, task.role._id);
      yield put(actions.initRole(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("ロール名を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveRoleName;
