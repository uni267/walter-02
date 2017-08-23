import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

import { fetchFiles, fileUpload } from "../apis";


function* watchFileUpload() {
  while (true) {
    const { dir_id, file } = yield take("FILE_UPLOAD");
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 1000);
      const uploadPayload = yield call(fileUpload, dir_id, file);
      yield put({ type: "PUSH_FILE_TO_BUFFER", file: uploadPayload.data.body });

      const filesPayload = yield call(fetchFiles, dir_id);
      yield put({ type: "INIT_FILES", files: filesPayload.data.body });
      yield put({ type: "TRIGGER_SNACK", message: "ファイルをアップロードしました" });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchFileUpload;
