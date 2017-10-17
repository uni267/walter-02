import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDeleteFile() {
  while (true) {
    const { file } = yield take(actions.deleteFile().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield call(delay, 1000);

    try {
      yield call(api.deleteFile, file);
      const payload = yield call(api.fetchFiles, file.dir_id);
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.toggleDeleteFileDialog(file));
      yield put(commons.triggerSnackbar(`${file.name}をごみ箱へ移動しました`));
      yield call(delay, 3000);
      yield put(commons.closeSnackbar());
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }

  }
}

export default watchDeleteFile;
