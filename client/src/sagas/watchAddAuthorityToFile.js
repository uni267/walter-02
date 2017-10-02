import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

const api = new API();

function* watchAddAuthorityToFile() {
  while (true) {
    const { file, user, role } = yield take(
      actions.addAuthorityToFile().type
    );

    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.addAuthorityToFile, file, user, role);
      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initAuthorityFileDialog(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("権限を追加しました"));
    }
    catch (e) {
      console.log(e);
      yield put(actions.loadingEnd());
    }
  }
}

export default watchAddAuthorityToFile;
