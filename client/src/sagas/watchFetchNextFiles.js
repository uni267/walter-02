import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions";

function* watchFetchNextFiles() {
  while (true) {
    const { dir_id, page } = yield take(actions.requestFetchNextFiles().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 500);
      const payload = yield call(api.fetchFiles, dir_id, page);
      yield put(actions.initNextFiles(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchNextFiles;
