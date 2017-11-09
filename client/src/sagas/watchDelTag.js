import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDelTag() {
  while (true) {
    const { file, tag } = yield take(actions.requestDelTag().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.fetchDelTag, file, tag);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(actions.initFileTag(payload.data.body));
      yield put(commons.triggerSnackbar("タグを削除しました"));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
      
  }
}

export default watchDelTag;
