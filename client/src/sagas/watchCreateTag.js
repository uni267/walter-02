import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";

function* watchCreateTag() {
  while (true) {
    const task = yield take(actions.createTag().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(api.createTag, task.tag);
      const payload = yield call(api.fetchTags);
      yield put(actions.initTags(payload.data.body));
      yield put(commonActions.loadingEnd());
      yield put(actions.initTag());
      yield task.history.push("/tags");
      yield put(commonActions.triggerSnackbar("タグを作成しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveTagValidationError(errors));
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchCreateTag;
