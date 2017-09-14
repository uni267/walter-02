import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSaveTagDescription() {
  while (true) {
    const task = yield take(actions.saveTagDescription().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.saveTagDescription, task.tag);
      const payload = yield call(API.fetchTag, task.tag._id);
      yield put(actions.initTag(payload.data.body));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveTagValidationError(errors));
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSaveTagDescription;
