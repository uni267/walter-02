import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchFetchFiles() {
  while (true) {
    const { dir_id, page, sorted, desc } = yield take(
      actionTypes.REQUEST_FETCH_FILES
    );

    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 500);

      if (page === 0 || page === null) {
        const [ files, dirs ] = yield all([
          call(api.fetchFiles, dir_id, page, sorted, desc),
          call(api.fetchDirs, dir_id)
        ]);

        yield put(actions.initFileTotal(files.data.status.total));
        yield put(actions.initFiles(files.data.body));
        yield put(actions.initDir(dirs.data.body));
      }
      else {
        const files = yield call(api.fetchFiles, dir_id, page, sorted, desc);
        yield put(actions.initNextFiles(files.data.body));
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }

  }
}

export default watchFetchFiles;
