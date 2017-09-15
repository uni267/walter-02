import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchMoveFile() {
  while (true) {
    const task = yield take(actions.moveFile().type);
    const { dir, file } = task;
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.moveFile, dir, file);
      const payload = yield call(API.fetchFiles, file.dir_id);
      yield put(actions.initFiles(payload.data.body));
      yield put(actions.triggerSnackbar(`${file.name}を${dir.name}に移動しました`));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchMoveFile;
