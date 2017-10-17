import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchMoveFiles() {
  while (true) {
    const task = yield take(actions.moveFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      const { dir, files } = task;
      const jobs = files.map( file => call(api.moveFile, dir, file) );
      yield all(jobs);
      const payload = yield call(api.fetchFiles, files[0].dir_id);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.toggleMoveFilesDialog());
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchMoveFiles;
