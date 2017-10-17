import { delay } from "redux-saga";
import { call, put, take, all, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDeleteFiles() {
  while (true) {
    const { files } = yield take(actions.deleteFiles().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield call(delay, 1000);

    try {
      const tenant = yield select( state => state.tenant );
      let message;

      if ( files[0].dir_id === tenant.trashDirId ) {
        const tasks = files.map ( file => call(api.deleteFile, file) );
        yield all(tasks);
        message = "ファイルをごみ箱から削除しました";
      }
      else {
        const tasks = files.map( file => call(api.moveFileTrash, file) );
        yield all(tasks);
        message = "ファイルをごみ箱へ移動しました";
      }

      const payload = yield call(api.fetchFiles, files[0].dir_id, 0);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.toggleDeleteFilesDialog());
      yield put(commons.triggerSnackbar(message));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteFiles;
