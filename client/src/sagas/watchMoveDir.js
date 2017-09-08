import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchMoveDir() {
  while (true) {
    const { destinationDir, movingDir } = yield take("MOVE_DIR");

    yield put({ type: "LOADING_START" });
    yield call(delay, 1000);

    try {
      yield call(API.moveDir, destinationDir, movingDir);
      const payload = yield call(API.fetchFiles, movingDir.dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      yield put({ type: "TRIGGER_SNACK", message: "フォルダを移動しました" });
      yield put({ type: "TOGGLE_MOVE_DIR_DIALOG" });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
    
  }
}

export default watchMoveDir;
