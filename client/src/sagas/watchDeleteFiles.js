import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchDeleteFiles() {
  while (true) {
    const task = yield take(actions.deleteFiles().type);
    const api = new API();
    yield put(actions.loadingStart());
    
    try {
      yield call(delay, 1000);
      const jobs = task.files.map( file => call(api.deleteFile, file) );
      yield all(jobs);
      const payload = yield call(api.fetchFiles, task.files[0].dir_id, 0);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.toggleDeleteFilesDialog());
    }
    catch (e) {
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDeleteFiles;
