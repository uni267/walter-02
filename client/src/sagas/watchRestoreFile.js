import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchRestoreFile() {
  while (true) {
    const { file } = yield take(actions.restoreFile().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.restoreFile, file);
      const payload = yield call(api.fetchFiles, file.dir_id);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.toggleRestoreFileDialog());
      yield put(commons.loadingEnd());
    }
    catch (e) {
      console.log(e);
    }
  }
}

export default watchRestoreFile;
