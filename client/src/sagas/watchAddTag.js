import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

function* watchAddTag() {
  while (true) {
    const { file, tag } = yield take("REQUEST_ADD_TAG");
    const api = new API();
    yield put({ type: "LOADING_START" });

    try {
      const payload = yield call(api.fetchAddTag, file, tag);
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

export default watchAddTag;
