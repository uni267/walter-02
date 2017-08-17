import { delay } from "redux-saga";
import { call, put, fork, take } from "redux-saga/effects";

// api
import { login, fetchUserById, fetchFiles } from "../apis";

function* watchFetchFiles() {
  while (true) {
    const task = yield take("REQUEST_FETCH_FILES");
    yield put({ type: "LOADING_START" });

    try {
      const files = yield call(fetchFiles, 0);
      yield put({ type: "INIT_FILE", files: files.data.body });
      yield put({ type: "LOADING_END" });
    }
    catch (e) {
      console.log(e);
      const message = e.response.data.status.message;
      const errors = e.response.data.status.errors;
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchFetchFiles;
