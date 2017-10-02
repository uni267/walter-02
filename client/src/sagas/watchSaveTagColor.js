import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

const api = new API();

function* watchSaveTagColor() {
  while (true) {
    const task = yield take(actions.saveTagColor().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.saveTagColor, task.tag);
      const payload = yield call(api.fetchTag, task.tag._id);
      yield put(actions.initTag(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("タグの色を保存しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveTagValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveTagColor;
