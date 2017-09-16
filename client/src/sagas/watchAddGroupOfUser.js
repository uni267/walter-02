import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchAddGroupOfUser() {
  while (true) {
    const task = yield take(actions.addGroupOfUser().type);

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(API.addGroupOfUser, task.user_id, task.group_id);

      const fetchJobs = [
        call(API.fetchUser, task.user_id),
        call(API.fetchGroupById, task.group_id)
      ];

      const payloads = yield all(fetchJobs);
      
      const putJobs = [
        put(actions.initUser(payloads[0].data.body)),
        put(actions.initGroup(payloads[1].data.body))
      ];

      yield all(putJobs);
      yield put(actions.loadingEnd());
      yield put(actions.triggerSnackbar("ユーザをグループに追加しました"));
    }
    catch (e) {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchAddGroupOfUser;
