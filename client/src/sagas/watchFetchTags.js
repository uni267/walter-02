import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchFetchTags() {
  while (true) {
    yield take(actions.requestFetchTags().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchTags);
      yield put(actions.initTags(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
      
  }
}

export default watchFetchTags;
