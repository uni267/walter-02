import { delay } from "redux-saga";
import { call, put, fork, take, all, select } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  addMetaInfo,
  initFile,
  loadingStart,
  loadingEnd,
  triggerSnackbar
} from "../actions";

function* watchAddMetaInfo() {
  while (true) {
    const { file, metaInfo, value } = yield take(addMetaInfo().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.addMetaInfo, file, metaInfo, value);
      const payload = yield call(API.fetchFile, file._id);
      yield put(initFile(payload.data.body));
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
