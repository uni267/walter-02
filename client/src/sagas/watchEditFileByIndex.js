import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { editFile, fetchFiles } from "../apis";

function* watchEditFileByIndex() {
  while (true) {
    const { file, refresh } = yield take("EDIT_FILE_BY_INDEX");

    try {
      yield put({ type: "LOADING_START" });
      yield call(delay, 1000);
      yield call(editFile, file);
      const payload = yield call(fetchFiles, file.dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchEditFileByIndex;
