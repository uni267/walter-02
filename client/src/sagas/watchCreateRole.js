import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchCreateRole() {
  while (true) {
    const task = yield take(actions.createRole().type);
    const api = new API();
    yield put(actions.clearRoleValidationError());

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(api.createRole, task.role);
      const payload = yield call(api.fetchRoles, localStorage.getItem("tenantId"));
      yield put(actions.initRoles(payload.data.body));
      yield put(actions.loadingEnd());
      yield task.history.push("/roles");
      yield put(actions.triggerSnackbar("ロールを作成しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchCreateRole;
