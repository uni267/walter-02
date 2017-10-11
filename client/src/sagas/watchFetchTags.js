import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";

function* watchFetchTags() {
  while (true) {
    const task = yield take(actions.requestFetchTags().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchTags, task.user_id);
      yield put(actions.initTags(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commonActions.loadingEnd());
    }
      
  }
}

export default watchFetchTags;
