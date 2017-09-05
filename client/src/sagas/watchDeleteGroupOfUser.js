import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  deleteGroupOfUser,
  initUser,
  initGroup,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchDeleteGroupOfUser() {
  while (true) {
    const task = yield take(deleteGroupOfUser().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.deleteGroupOfUser, task.user_id, task.group_id);

      const fetchJobs = [
        call(API.fetchUser, task.user_id),
        call(API.fetchGroupById, task.group_id)
      ];

      const payloads = yield all(fetchJobs);

      const putJobs = [
        put(initUser(payloads[0].data.body)),
        put(initGroup(payloads[1].data.body))
      ];

      yield all(putJobs);
    }
    catch (e) {
      
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchDeleteGroupOfUser;
