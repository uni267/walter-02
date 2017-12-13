import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchMoveFile() {
  while (true) {
    const task = yield take(actions.moveFile().type);
    const api = new API();
    const { dir, file } = task;
    yield put(commons.loadingStart());

    try {
      yield call(api.moveFile, dir, file);
      const { sorted, desc } = yield select( state => state.fileSortTarget );
      const payload = yield call(api.fetchFiles, file.dir_id , 0 , sorted, desc );
      yield put(actions.initFiles(payload.data.body));

      // DnDから呼ばれる場合もあるので
      const dialogOpen = yield select( state => state.moveFile.open );

      if (dialogOpen === true) {
        yield put(actions.toggleMoveFileDialog());
      }

      yield put(commons.triggerSnackbar(`${file.name}を${dir.name}に移動しました`));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchMoveFile;
