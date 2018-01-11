import { call, put, take, all, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDeleteFiles() {
  while (true) {
    const { files } = yield take(actions.deleteFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const tenant = yield select( state => state.tenant );
      let message;

      let response;
      if ( files[0].dir_id === tenant.trashDirId ) {
        const tasks = files.map ( file => call(api.deleteFile, file) );
        response = yield all(tasks);
        message = "ファイルをごみ箱から削除しました";
      }
      else {
        const tasks = files.map( file => call(api.moveFileTrash, file) );
        response = yield all(tasks);
        message = "ファイルをごみ箱へ移動しました";
      }

      const deletedFileIds = response.filter(res => res.status == 200 ).map(res => res.data.body._id);
      yield put(actions.deleteFileRows(deletedFileIds));

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
