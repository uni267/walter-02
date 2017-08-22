import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { editFile, fetchFile } from "../apis";

function* watchEditFileByView() {
  while (true) {
    const { file, refresh } = yield take("EDIT_FILE_BY_VIEW");

    try {
      yield put({ type: "LOADING_START" });
      yield call(delay, 1000);
      yield call(editFile, file);
      const payload = yield call(fetchFile, file._id);
      yield put({ type: "INIT_FILE", file: payload.data.body });
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchEditFileByView;
