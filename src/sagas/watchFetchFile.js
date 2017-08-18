import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { fetchFile } from "../apis";

function* watchFetchFile() {

  while (true) {
    const { file_id } = yield take("REQUEST_FETCH_FILE");
    yield put({ type: "LOADING_START" });

    try {
      const payload = yield call(fetchFile, file_id);
      yield put({ type: "INIT_FILE", file: payload.data.body });
      yield call(delay, 1000);
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }

}

export default watchFetchFile;
