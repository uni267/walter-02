import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchCreateGroup() {
  while (true) {
    const task = yield take(actions.createGroup().type);
    const api = new API();
    yield put(actions.clearGroupValidationError());

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(api.createGroup, task.group);
      const payload = yield call(api.fetchGroup);
      yield put(actions.initGroups(payload.data.body));
      yield put(actions.loadingEnd());
      yield task.history.push("/groups");
      yield put(actions.triggerSnackbar("グループを作成しました"));
      yield call(delay, 3000);
      yield put(actions.closeSnackbar());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveGroupValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchCreateGroup;
