import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

import { moveFile, fetchFiles } from "../apis";

function* watchMoveFile() {
  while (true) {
    const { dir, file } = yield take("MOVE_FILE");
    console.log(dir,file);
    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      yield call(moveFile, dir, file);
      const payload = yield call(fetchFiles, file.dir_id);
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
