import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchEditFileByView() {
  while (true) {
    const { file } = yield take(actions.editFileByView().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.editFile, file);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(commons.triggerSnackbar("ファイル名を変更しました"));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchEditFileByView;
