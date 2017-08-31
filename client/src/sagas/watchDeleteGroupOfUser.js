import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  deleteGroupOfUser,
  initUser,
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
      const payload = yield call(API.fetchUser, task.user_id);
      yield put(initUser(payload.data.body));
    }
    catch (e) {
      
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchDeleteGroupOfUser;
