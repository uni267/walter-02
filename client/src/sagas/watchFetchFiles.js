import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  requestFetchFiles,
  loadingStart,
  loadingEnd,
  initFiles,
  initDir
} from "../actions";

function* watchFetchFiles() {
  while (true) {
    const { dir_id } = yield take(requestFetchFiles().type);
    yield put(loadingStart());

    try {
      yield call(delay, 500);

      const [ files, dirs ] = yield all([
        call(API.fetchFiles, dir_id),
        call(API.fetchDirs, dir_id)
      ]);

      yield put(initFiles(files.data.body));
      yield put(initDir(dirs.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }

  }
}

export default watchFetchFiles;
