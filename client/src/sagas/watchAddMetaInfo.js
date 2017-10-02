import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

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

const api = new API();

function* watchAddMetaInfo() {
  while (true) {
    const { file, metaInfo, value } = yield take(addMetaInfo().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.addMetaInfo, file, metaInfo, value);
      const filePayload = yield call(api.fetchFile, file._id);
      yield put(initFile(filePayload.data.body));
      yield put(updateMetaInfoTarget(filePayload.data.body));

      const filesPayload = yield call(api.fetchFiles, file.dir_id);
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
