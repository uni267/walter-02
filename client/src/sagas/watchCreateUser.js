import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  createUser,
  initUsers,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchCreateUser() {
  while (true) {
    const task = yield take(createUser().type);
    
    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.createUser, task.user);
      const payload = yield call(API.fetchUsers, localStorage.getItem("tenantId"));
      yield put(initUsers(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }

    yield call(task.history.push("/users"));
  }

}

export default watchCreateUser;
