import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  addGroupOfUser,
  initUser,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchAddGroupOfUser() {
  while (true) {
    const task = yield take(addGroupOfUser().type);
    console.log(task);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.addGroupOfUser, task.user_id, task.group_id);
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

export default watchAddGroupOfUser;
