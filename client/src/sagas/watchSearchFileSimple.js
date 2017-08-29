import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

import { API } from "../apis";

function* watchSearchFileSimple() {
  while (true) {
    const { value } = yield take("SEARCH_FILE_SIMPLE");
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      const payload = yield call(API.searchFiles, value);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      const { dirId } = yield select(state => state.tenant);

      const dirs = [
        { _id: dirId, name: "Top" },
        "sep",
        { _id: dirId, name: "検索結果" }
      ];

      yield put({ type: "INIT_DIR", dirs });
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