import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/index";
import * as commons from "../actions/commons";

function* watchUpdateNotificationsRead() {
  while(true){
    const task = yield take(actions.requestUpdateNotificationsRead().type);
    const api = new API();
    yield put(commons.loadingStart);
    try {
      yield call(api.updateNotificationsRead, task.notifications);
      const payload = yield call(api.fetchNotification);
      yield put(actions.initNotificaiton(payload.data.body, payload.data.status.unread));
    } catch (e) {
    }
    finally{
      yield put(commons.loadingEnd());
    }
  }

}

export default watchUpdateNotificationsRead;