import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/groups";
import * as commons from "../actions/commons";

function* watchSaveGroupDescription() {
  while (true) {
    const task = yield take(actions.saveGroupDescription().type);
    const api = new API();
    yield put(actions.clearGroupValidationError());

    try {
      yield put(commons.loadingStart());
      yield call(delay, 1000);
      yield call(api.saveGroupDescription, task.group);
      const payload = yield call(api.fetchGroupById, task.group._id);
      yield put(actions.initGroup(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("グループの備考を変更しました"));
      yield call(delay, 3000);
      yield put(commons.closeSnackbar());
    }
    catch (e) {
      console.log(e);
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveGroupDescription;
