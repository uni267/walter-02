import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchDelTag() {
  while (true) {
    const { file, tag } = yield take("REQUEST_DEL_TAG");
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchDelTag, file, tag);
      yield put({ type: "INIT_FILE", file: payload.data.body });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
      
  }
}

export default watchDelTag;
