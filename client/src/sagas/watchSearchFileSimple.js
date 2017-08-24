import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

import { searchFiles } from "../apis";

function* watchSearchFileSimple() {
  while (true) {
    const { value } = yield take("SEARCH_FILE_SIMPLE");
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      const payload = yield call(searchFiles, value);
      yield put({ type: "INIT_FILES", files: payload.data.body });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchSearchFileSimple;
