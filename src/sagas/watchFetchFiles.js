import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { fetchFiles, fetchDirs } from "../apis";

function* watchFetchFiles() {
  while (true) {
    const { dir_id } = yield take("REQUEST_FETCH_FILES");
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 500);

      const [ files, dirs ] = yield all([
        call(fetchFiles, dir_id),
        call(fetchDirs, dir_id)
      ]);

      yield put({ type: "INIT_FILE", files: files.data.body });
      yield put({ type: "INIT_DIR", dirs: dirs.data.body });
      const _dirs = yield select(state => state.dirs);
      console.log(_dirs);
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }

  }
}

export default watchFetchFiles;
