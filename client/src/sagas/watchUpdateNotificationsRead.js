import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/index";
import * as commons from "../actions/commons";

function* watchUpdateNotificationsRead() {
  while(true){
    const task = yield take(actions.requestUpdateNotificationsRead().type);
    const unreadNotificaitons = task.notifications.filter(notification => ( notification.notifications.read === false ) );
    const api = new API();
    yield put(commons.loadingStart);
    try {
      if(unreadNotificaitons.length > 0){
        yield call(api.updateNotificationsRead, unreadNotificaitons);
        const payload = yield call(api.fetchNotification);
        yield put(actions.initNotificaiton(payload.data.body, payload.data.status));
      }
    } catch (e) {
    }
    finally{
      yield put(commons.loadingEnd());
    }
  }

}

export default watchUpdateNotificationsRead;