import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  deleteMetaInfo,
  loadingStart,
  loadingEnd,
  initFile,
  triggerSnackbar
} from "../actions";

function* watchDeleteMetaInfo() {
  while (true) {
    const { file, metaInfo } = yield take(deleteMetaInfo().type);
    const api = new API();
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.deleteMetaInfo, file, metaInfo);
      const payload = yield call(api.fetchFile, file._id);
      yield put(initFile(payload.data.body));
      yield put(triggerSnackbar("メタ情報を削除しました"));
    }
    catch (e) {
      
    }
    finally {
      yield put(loadingEnd());
    }
    
  }
}

export default watchDeleteMetaInfo;
