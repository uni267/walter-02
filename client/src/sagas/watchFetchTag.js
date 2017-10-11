import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";

function* watchFetchTag() {
  while (true) {
    const task = yield take(actions.requestFetchTag().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchTag, task.tag_id);
      yield put(actions.initTag(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchFetchTag;
