import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveGroupName,
  initGroup,
  loadingStart,
  loadingEnd,
  saveGroupNameValidationError
} from "../actions";

function* watchSaveGroupName() {
  while (true) {
    const task = yield take(saveGroupName().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      const payload = yield call(API.saveGroupName, task.group);
      yield put(initGroup(payload.data.body));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(saveGroupNameValidationError(errors));
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchSaveGroupName;
