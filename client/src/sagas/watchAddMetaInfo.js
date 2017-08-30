import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  addMetaInfo,
  initFile,
  initFiles,
  loadingStart,
  loadingEnd,
  triggerSnackbar,
  updateMetaInfoTarget
} from "../actions";

function* watchAddMetaInfo() {
  while (true) {
    const { file, metaInfo, value } = yield take(addMetaInfo().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.addMetaInfo, file, metaInfo, value);
      const filePayload = yield call(API.fetchFile, file._id);
      yield put(initFile(filePayload.data.body));
      yield put(updateMetaInfoTarget(filePayload.data.body));

      const filesPayload = yield call(API.fetchFiles, file.dir_id);
      yield put(initFiles(filesPayload.data.body));
      yield put(triggerSnackbar("メタ情報を追加しました"));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchAddMetaInfo;
