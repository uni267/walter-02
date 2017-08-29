import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

import { API } from "../apis";

function* watchFetchTags() {
  while (true) {
    yield take("REQUEST_FETCH_TAGS");
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchTags);
      yield put({ type: "INIT_TAGS", tags: payload.data.body });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
      
  }
}

export default watchFetchTags;
