import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchRestoreFiles() {
  while (true) {
    const { files } = yield take(actions.restoreFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      const tasks = files.map( file => call(api.restoreFile, file) );
      yield all(tasks);
      const payload = yield call(api.fetchFiles, files[0].dir_id);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.toggleRestoreFilesDialog());
      yield put(commons.loadingEnd());
    }
    catch (e) {
      console.log(e);
    }
  }
}

export default watchRestoreFiles;
