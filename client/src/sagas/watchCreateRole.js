import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/roles";
import * as commons from "../actions/commons";

function* watchCreateRole() {
  while (true) {
    const task = yield take(actions.createRole().type);
    const api = new API();
    yield put(actions.clearRoleValidationError());

    try {
      yield put(commons.loadingStart());
      yield call(api.createRole, task.role);
      const payload = yield call(api.fetchRoles);
      yield put(actions.initRoles(payload.data.body));
      yield put(commons.loadingEnd());
      yield task.history.push("/roles");
      yield put(commons.triggerSnackbar("ロールを作成しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchCreateRole;
