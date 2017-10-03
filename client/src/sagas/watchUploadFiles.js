import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions";

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files } = yield take(actions.uploadFiles().type);
    const api = new API();
    yield put(actions.loadingStart());
    yield call(delay, files.length * 1000);

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
      yield put(actions.triggerSnackbar("ファイルをアップロードしました"));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }

  }
}

export default watchUploadFiles;
