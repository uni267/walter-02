import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchAddTag() {
  while (true) {
    const { file, tag } = yield take("REQUEST_ADD_TAG");
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 1000);
      const payload = yield call(API.fetchAddTag, file, tag);
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

export default watchAddTag;
