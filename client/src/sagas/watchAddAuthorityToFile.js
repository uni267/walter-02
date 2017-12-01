import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchAddAuthorityToFile() {
  while (true) {
    const { file, user, role } = yield take(
      actions.addAuthorityToFile().type
    );

    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.addAuthorityToFile, file, user, role);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("権限を追加しました"));
    }
    catch (e) {
      const { message } = e.response.data.status;
      if (e.response.data.status.errors.role_set !== undefined) {
        const detail = e.response.data.status.errors.role_set;
        yield put(commons.openException(message, detail));
      } else {
        yield put(commons.openException(message));
      }
      yield put(commons.loadingEnd());
    }
  }
}

export default watchAddAuthorityToFile;
