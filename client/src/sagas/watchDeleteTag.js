import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchDeleteTag() {
  while (true) {
    const task = yield take(actions.deleteTag().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(API.deleteTag, task.tag_id);
      const payload = yield call(API.fetchTags);
      yield put(actions.initTags(payload.data.body));
      yield put(actions.loadingEnd());
      yield task.history.push("/tags");
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }

  }
}

export default watchDeleteTag;
