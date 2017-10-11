import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchDeleteGroupOfUser() {
  while (true) {
    const task = yield take(actions.deleteGroupOfUser().type);
    const api = new API();

    try {
      yield put(commonActions.loadingStart());
      yield call(delay, 1000);
      yield call(api.deleteGroupOfUser, task.user_id, task.group_id);

      const fetchJobs = [
        call(api.fetchUser, task.user_id),
        call(api.fetchGroupById, task.group_id)
      ];

      const payloads = yield all(fetchJobs);

      const putJobs = [
        put(actions.initUser(payloads[0].data.body)),
        put(actions.initGroup(payloads[1].data.body))
      ];

      yield all(putJobs);
      yield put(commonActions.loadingEnd());
      yield put(commonActions.triggerSnackbar("ユーザをグループから削除しました"));
      yield call(delay, 3000);
      yield put(commonActions.closeSnackbar());
    }
    catch (e) {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchDeleteGroupOfUser;
