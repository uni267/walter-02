import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

const api = new API();

function* watchCreateTag() {
  while (true) {
    const task = yield take(actions.createTag().type);
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.createTag, task.tag);
      const payload = yield call(api.fetchTags);
      yield put(actions.initTags(payload.data.body));
      yield put(actions.loadingEnd());
      yield put(actions.initTag());
      yield task.history.push("/tags");
      yield put(actions.triggerSnackbar("タグを作成しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveTagValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchCreateTag;
