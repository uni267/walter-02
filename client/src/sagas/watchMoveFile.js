import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchMoveFile() {
  while (true) {
    const { dir, file } = yield take("MOVE_FILE");
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      yield call(API.moveFile, dir, file);
      const payload = yield call(API.fetchFiles, file.dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      yield put({
        type: "TRIGGER_SNACK",
        message: `${file.name}を${dir.name}に移動しました`
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

export default watchMoveFile;
