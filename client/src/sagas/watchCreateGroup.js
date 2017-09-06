import { delay } from "redux-saga";
import { call, put, take, all } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  createGroup,
  loadingStart,
  loadingEnd,
  initGroups,
  requestFetchGroups
} from "../actions";

function* watchCreateGroup() {
  while (true) {
    const task = yield take(createGroup().type);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.createGroup, task.group);
      const payload = yield call(API.fetchGroup, localStorage.getItem("tenantId"));
      yield put(initGroups(payload.data.body));
      yield put(loadingEnd());
      yield call(task.history.push("/groups"));
    }
    catch (e) {
      yield put(loadingEnd());
    }
  }
}

export default watchCreateGroup;
