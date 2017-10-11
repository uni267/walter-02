import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";

function* watchDeleteTag() {
  while (true) {
    const task = yield take(actions.deleteTag().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.deleteTag, task.tag_id);
      const payload = yield call(api.fetchTags);
      yield put(actions.initTags(payload.data.body));
      yield put(commonActions.loadingEnd());
      yield task.history.push("/tags");
      yield put(actions.initTag());
      yield put(commonActions.triggerSnackbar("タグを削除しました"));
      yield call(delay, 3000);
      yield put(commonActions.closeSnackbar());
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commonActions.loadingEnd());
    }

  }
}

export default watchDeleteTag;
