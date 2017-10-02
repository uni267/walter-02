import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  loadingStart,
  loadingEnd,
  searchUsersSimple,
  initUsers
} from "../actions";

const api = new API();

function* watchSearchUsersSimple() {
  while (true) {
    const task = yield take(searchUsersSimple().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.searchUsersSimple, task.tenant_id, task.keyword);
      yield put(initUsers(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSearchUsersSimple;
