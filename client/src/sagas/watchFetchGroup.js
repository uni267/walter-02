import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import {
  requestFetchGroup,
  loadingStart,
  loadingEnd,
  initGroup
} from "../actions";

function* watchFetchGroup() {
  while (true) {
    const task = yield take(requestFetchGroup().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      const payload = yield call(API.fetchGroupById, task.group_id);
      yield put(initGroup(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchFetchGroup;
