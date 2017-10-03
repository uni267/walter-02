import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

function* watchEditFileByView() {
  while (true) {
    const { file } = yield take("EDIT_FILE_BY_VIEW");
    const api = new API();

    try {
      yield put({ type: "LOADING_START" });
      yield call(delay, 1000);
      yield call(api.editFile, file);
      const payload = yield call(api.fetchFile, file._id);
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
