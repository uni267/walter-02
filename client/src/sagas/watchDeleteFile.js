import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchDeleteFile() {
  while (true) {
    const { file } = yield take(actions.deleteFile().type);
    const api = new API();
    yield put(actions.loadingStart());
    yield call(delay, 1000);

    try {
      yield call(api.deleteFile, file);
      const payload = yield call(api.fetchFiles, file.dir_id);
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.toggleDeleteFileDialog(file));
      yield put(actions.triggerSnackbar(`${file.name}をごみ箱へ移動しました`));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }

  }
}

export default watchDeleteFile;
