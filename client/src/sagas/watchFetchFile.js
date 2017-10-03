import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

function* watchFetchFile() {

  while (true) {
    const { file_id } = yield take("REQUEST_FETCH_FILE");
    const api = new API();
    yield put({ type: "LOADING_START" });

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchFile, file_id);
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

export default watchFetchFile;
