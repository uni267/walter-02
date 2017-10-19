import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDeleteFile() {
  while (true) {
    const { file } = yield take(actions.deleteFile().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const tenant = yield select(state => state.tenant);

      let message;

      if (file.dir_id === tenant.trashDirId) {
        yield call(api.deleteFile, file);
        message = `${file.name} をごみ箱から削除しました`;
      }
      else {
        yield call(api.moveFileTrash, file);
        message = `${file.name} をごみ箱へ移動しました`;
      }
      const payload = yield call(api.fetchFiles, file.dir_id);
      yield put(actions.initFileTotal(payload.data.status.total));
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.toggleDeleteFileDialog(file));
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

export default watchDeleteFile;
