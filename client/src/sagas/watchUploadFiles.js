import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions";

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files } = yield take(actions.uploadFiles().type);
    yield put(actions.loadingStart());
    yield call(delay, files.length * 1000);

    try {
      const tasks = files.map( file => call(API.fileUpload, dir_id, file) );
      const uploadPayloads = yield all(tasks);

      const buffers = uploadPayloads.map( pay => pay.data.body )
            .map( body => put(actions.pushFileToBuffer(body)));

      yield all(buffers);

      const filesPayload = yield call(API.fetchFiles, dir_id);

      const uploadFileIds = uploadPayloads.map( pay => pay.data.body)
            .map( body => body._id);

      yield put(actions.initFiles(filesPayload.data.body));

      const toggleCheckTasks = filesPayload.data.body.filter( file => {
        return uploadFileIds.includes(file._id);
      }).map( file => put(actions.toggleFileCheck(file)) );

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
