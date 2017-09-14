import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchFetchTag() {
  while (true) {
    const task = yield take(actions.requestFetchTag().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchTag, task.tag_id);
      yield put(actions.initTag(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchTag;
