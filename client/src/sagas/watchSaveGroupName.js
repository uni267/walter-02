import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveGroupName() {
  while (true) {
    const task = yield take(actions.saveGroupName().type);
    const api = new API();
    yield put(actions.clearGroupValidationError());

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(api.saveGroupName, task.group);
      const payload = yield call(api.fetchGroupById, task.group._id);
      yield put(actions.initGroup(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("グループ名を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveGroupValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveGroupName;
