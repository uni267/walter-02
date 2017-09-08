import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveGroupDescription,
  initGroup,
  loadingStart,
  loadingEnd,
  clearGroupValidationError
} from "../actions";

function* watchSaveGroupDescription() {
  while (true) {
    const task = yield take(saveGroupDescription().type);
    yield put(clearGroupValidationError());

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      const payload = yield call(API.saveGroupDescription, task.group);
      yield put(initGroup(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchSaveGroupDescription;
