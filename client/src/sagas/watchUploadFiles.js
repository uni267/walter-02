import { call, put, take, all } from "redux-saga/effects";
import MD5 from "crypto-js/md5";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files } = yield take(actions.uploadFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      // const uploadPayload = yield call(api.filesUpload, dir_id, files);

      // fileのパース yieldでコールするのでpromiseでラップしておく
      const readFile = file => {
        return new Promise( (resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = e => {
            resolve({
              name: file.name,
              size: file.size,
              mime_type: file.type,
              modified: file.lastModified,
              base64: reader.result,
              checksum: MD5(reader.result).toString()
            });
          };
        });
      };

      const _files = yield all(files.map( f => readFile(f) ));
      const uploadPayload = yield call(api.filesUploadBlob, dir_id, _files);

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
