import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchDeleteAuthorityToFile() {
  while (true) {
    const { file, user, role } = yield take(
      actions.deleteAuthorityToFile().type
    );

    const api = new API();
    yield put(commons.loadingStart());

    try {
      console.log(file,user,role);
      yield call(api.deleteAuthorityToFile, file, user, role);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("権限を削除しました"));
    }
    catch (e) {
      const { message, errors } = e.response.data.status;
      yield put(commons.openException(message, JSON.stringify(errors)));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteAuthorityToFile;
