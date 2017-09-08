import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchDeleteFile() {
  while (true) {
    const { file } = yield take("DELETE_FILE");
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      yield call(API.deleteFile, file);
      const payload = yield call(API.fetchFiles, file.dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      yield put({ type: "TOGGLE_DELETE_FILE_DIALOG", file: file });
      yield put({
        type: "TRIGGER_SNACK",
        message: `${file.name}をごみ箱へ移動しました` 
      });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }

  }
}

export default watchDeleteFile;
