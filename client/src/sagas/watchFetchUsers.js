import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchFetchUsers() {
  while (true) {
    yield take(actions.requestFetchUsers().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.fetchUsers);
      yield put(actions.initUsers(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commonActions.loadingEnd());
    }

  }
}

export default watchFetchUsers;
