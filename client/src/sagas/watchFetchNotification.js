import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/index";
import * as commons from "../actions/commons";

function* watchFetchNotification(){
  while(true) {
    yield take(actions.requestFetchNotification().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchNotification);
      yield put(actions.initNotificaiton(payload.data.body, payload.data.status.unread));
    } catch (e) {

    }
    finally{
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchNotification;