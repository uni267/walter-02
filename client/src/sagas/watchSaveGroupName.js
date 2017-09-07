import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveGroupName,
  initGroup,
  loadingStart,
  loadingEnd,
  saveGroupValidationError,
  clearGroupValidationError
} from "../actions";

function* watchSaveGroupName() {
  while (true) {
    const task = yield take(saveGroupName().type);
    yield put(clearGroupValidationError());

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.saveGroupName, task.group);
      const payload = yield call(API.fetchGroupById, task.group._id);
      yield put(initGroup(payload.data.body));
      yield put(loadingEnd());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(saveGroupValidationError(errors));
      yield put(loadingEnd());
    }
  }
}

export default watchSaveGroupName;
