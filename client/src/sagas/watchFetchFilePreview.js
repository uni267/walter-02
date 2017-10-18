import { delay } from "redux-saga";
import { call, put, take, fork } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* fetchFilePreview(file_id) {
  const api = new API();
  const payload = yield call(api.fetchFilePreview, file_id);
  const { preview_id } = payload.data.body;
  
  return preview_id === null ? false : preview_id;
}

function* watchFetchFilePreview() {
  while (true) {
    const { file_id } = yield take(actions.requestFetchFilePreview().type);
    const api = new API();

    try {
      yield put(actions.initFilePreviewBody());
      yield put(actions.toggleLoadingFilePreview());
      let preview_id = yield call(fetchFilePreview, file_id);

      while (!preview_id) {
        yield call(delay, 3000);
        preview_id = yield call(fetchFilePreview, file_id);
      }

      yield put(actions.initFilePreview(preview_id));
      const payload = yield call(api.fetchFilePreviewBody, preview_id);
      yield put(actions.initFilePreviewBody(payload.data.body));
      yield put(actions.toggleLoadingFilePreview());
    }
    catch (e) {
      console.log(e.message);
    }
  }
}

export default watchFetchFilePreview;
