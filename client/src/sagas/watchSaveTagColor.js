import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveTagColor() {
  while (true) {
    const task = yield take(actions.saveTagColor().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.saveTagColor, task.tag);
      const payload = yield call(api.fetchTag, task.tag._id);
      yield put(actions.initTag(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("タグの色を保存しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveTagValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveTagColor;
