import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files } = yield take(actions.uploadFiles().type);
    const api = new API();
    yield put(commons.loadingStart());
    yield call(delay, 1000);

    try {
      const uploadPayload = yield call(api.filesUpload, dir_id, files);

      const buffers = uploadPayload.data.body.map( body => (
        put(actions.pushFileToBuffer(body))
      ));

      yield all(buffers);

      const uploadFileIds = uploadPayload.data.body.map( body => body._id );

      const filesPayload = yield call(api.fetchFiles, dir_id);
      yield put(actions.initFiles(filesPayload.data.body));

      const toggleCheckTasks = filesPayload.data.body.filter( file => (
        uploadFileIds.includes(file._id)
      )).map( file => put(actions.toggleFileCheck(file)) );

      yield all(toggleCheckTasks);
      yield put(commons.triggerSnackbar("ファイルをアップロードしました"));
      yield call(delay, 3000);
      yield put(commons.closeSnackbar());
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }

  }
}

export default watchUploadFiles;
