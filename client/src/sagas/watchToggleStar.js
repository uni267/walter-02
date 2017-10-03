import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchToggleStar() {
  while (true) {
    const task = yield take(actions.toggleStar().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 500);
      yield call(api.toggleStar, task.file);
      const payload = yield call(api.fetchFiles, task.file.dir_id);
      yield put(actions.initFiles(payload.data.body));
      const message = yield task.file.is_star === false
            ? "お気に入りに設定しました"
            : "お気に入りを解除しました";
      yield put(actions.triggerSnackbar(message));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchToggleStar;
