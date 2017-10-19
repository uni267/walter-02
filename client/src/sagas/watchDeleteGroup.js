import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/groups";
import * as commons from "../actions/commons";

function* watchDeleteGroup() {
  while (true) {
    const task = yield take(actions.deleteGroup().type);
    const api = new API();

    try {
      yield put(commons.loadingStart());
      yield call(api.deleteGroup, task.group_id);
      const payload = yield call(api.fetchGroup);
      yield put(actions.initGroups(payload.data.body));
      yield task.history.push("/groups");
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("グループを削除しました"));
    }
    catch (e) {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteGroup;
