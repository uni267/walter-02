import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files } = yield take("UPLOAD_FILES");
    yield put({ type: "LOADING_START" });
    yield call(delay, files.length * 1000);

    try {
      const tasks = files.map( file => call(API.fileUpload, dir_id, file) );
      const uploadPayloads = yield all(tasks);

      const buffers = uploadPayloads.map( pay => pay.data.body )
            .map( body => put({ type: "PUSH_FILE_TO_BUFFER", file: body }) );

      yield all(buffers);

      const filesPayload = yield call(API.fetchFiles, dir_id);
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

export default watchUploadFiles;
