import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchFetchDirTree() {
  while (true) {
    const { root_id } = yield take("REQUEST_FETCH_DIR_TREE");
    const api = new API();
    yield put({ type: "LOADING_FETCH_DIR_TREE" });
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      const payload = yield call(api.fetchDirTree, root_id);
      yield put({ type: "PUT_DIR_TREE", node: payload.data });
    }
    catch (e) {
    }
    finally {
      yield put({ type: "LOADING_END" });
    }

  }
}

export default watchFetchDirTree;
