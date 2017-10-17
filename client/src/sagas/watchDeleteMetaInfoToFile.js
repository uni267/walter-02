import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchDeleteMetaInfoToFile() {
  while (true) {
    const { file, metaInfo } = yield take(actionTypes.DELETE_META_INFO_TO_FILE);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.deleteMetaInfoToFile, file, metaInfo);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFileMetaInfo(payload.data.body));
      yield put(commons.triggerSnackbar("メタ情報を削除しました"));
    }
    catch (e) {
      
    }
    finally {
      yield put(commons.loadingEnd());
    }
    
  }
}

export default watchDeleteMetaInfoToFile;
