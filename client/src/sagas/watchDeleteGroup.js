import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import {
  deleteGroup,
  loadingStart,
  loadingEnd,
  initGroups
} from "../actions";

function* watchDeleteGroup() {
  while (true) {
    const task = yield take(deleteGroup().type);
    console.log(task);

    try {
      yield put(loadingStart());
      yield call(delay, 1000);
      yield call(API.deleteGroup, task.group_id);
      const payload = yield call(API.fetchGroup, localStorage.getItem("tenantId"));
      yield put(initGroups(payload.data.body));
      yield call(task.history.push("/groups"));
    }
    catch (e) {
    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchDeleteGroup;
