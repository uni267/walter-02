import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

import { saveAs } from "file-saver";

function* watchDownloadFile() {
  while (true) {
    const { file } = yield take(actions.downloadFile().type);

    try {
      yield call(delay, 1000);
      yield put(actions.loadingStart());
      const payload = yield call(API.downloadFile, file);
      const blob = yield new Blob([ payload.data.body ], { type: file.mime_type });
      yield saveAs(blob, file.name);
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchDownloadFile;
