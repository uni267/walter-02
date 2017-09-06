import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  saveGroupDescription,
  initGroup,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSaveGroupDescription() {
  while (true) {
    const task = yield take(saveGroupDescription().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      console.log(task);
      const payload = yield call(API.saveGroupDescription, task.group);
      yield put(initGroup(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchSaveGroupDescription;
