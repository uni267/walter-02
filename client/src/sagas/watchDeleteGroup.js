import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchDeleteGroup() {
  while (true) {
    const task = yield take(actions.deleteGroup().type);
    const api = new API();

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(api.deleteGroup, task.group_id);
      const payload = yield call(api.fetchGroup, localStorage.getItem("tenantId"));
      yield put(actions.initGroups(payload.data.body));
      yield task.history.push("/groups");
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("グループを削除しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDeleteGroup;
