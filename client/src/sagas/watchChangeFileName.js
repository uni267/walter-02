import { put, take, call } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchChangeFileName() {
  while(true) {
    const { file, name } = yield take(actions.changeFileName().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.changeFileName, file, name);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(commons.triggerSnackbar("ファイル名を変更しました"));
      yield put(commons.loadingEnd());
      yield put(actions.toggleChangeFileNameDialog(file));
    }
    catch (e) {
      const { message, errors } = e.response.data.status;
      yield put(actions.changeFileNameError(errors));
      yield put(commons.openException(message));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchChangeFileName;
