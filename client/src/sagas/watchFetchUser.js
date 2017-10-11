import { delay } from "redux-saga";
import { all, call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchFetchUser() {
  while (true) {
    const task = yield take(actions.requestFetchUser().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      yield call(delay, 1000);
      const [user, group] = yield all([
        call(api.fetchUser, task.user_id),
        call(api.fetchGroup, task.tenant_id)
      ]);

      yield put(actions.initUser(user.data.body));
      yield put(actions.initGroups(group.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commonActions.loadingEnd());
    }

  }
}

export default watchFetchUser;
