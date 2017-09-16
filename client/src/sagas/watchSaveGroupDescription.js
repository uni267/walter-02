import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveGroupDescription() {
  while (true) {
    const task = yield take(actions.saveGroupDescription().type);
    yield put(actions.clearGroupValidationError());

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      const payload = yield call(API.saveGroupDescription, task.group);
      yield put(actions.initGroup(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("グループの備考を変更しました"));
    }
    catch (e) {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveGroupDescription;
