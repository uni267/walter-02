import { call, put, take, all, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchMoveFiles() {
  while (true) {
    const task = yield take(actions.moveFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const { dir, files } = task;
      const jobs = files.map( file => call(api.moveFile, dir, file) );
      yield all(jobs);


      const { sorted, desc } = yield select( state => state.fileSortTarget );
      const payload = yield call(api.fetchFiles, files[0].dir_id, 0, sorted, desc);
      yield put(actions.initFiles(payload.data.body));

      const dialogOpen = yield select( state => state.moveFile.open );
      if (dialogOpen === true) {
        yield put(actions.toggleMoveFileDialog());
      }

      yield put(commons.triggerSnackbar(`選択された${files.length}個のファイルを${dir.name}に移動しました`));

    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchMoveFiles;
