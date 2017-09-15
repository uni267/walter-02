import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchDeleteFiles() {
  while (true) {
    const task = yield take(actions.deleteFiles().type);
    yield put(actions.loadingStart());
    
    try {
      yield call(delay, 1000);
      const jobs = task.files.map( file => call(API.deleteFile, file) );
      yield all(jobs);
      const payload = yield call(API.fetchFiles, task.files[0].dir_id);
      yield put(actions.initFiles(payload.data.body));
    }
    catch (e) {
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDeleteFiles;
