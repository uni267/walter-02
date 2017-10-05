import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchAddMetaInfo() {
  while (true) {
    const { file, metaInfo, value } = yield take(actions.addMetaInfo().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.addMetaInfo, file, metaInfo, value);
      const filePayload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(filePayload.data.body));
      yield put(actions.updateMetaInfoTarget(filePayload.data.body));

      const filesPayload = yield call(api.fetchFiles, file.dir_id);
      yield put(actions.initFiles(filesPayload.data.body));
      yield put(actions.triggerSnackbar("メタ情報を追加しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchAddMetaInfo;
