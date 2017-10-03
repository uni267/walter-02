import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchSearchGroupSimple() {
  while (true) {
    const { keyword } = yield take(actions.searchGroupSimple().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      yield call(delay, 1000);
      const payload = yield call(api.searchGroupSimple, keyword);
      yield put(actions.initGroups(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchSearchGroupSimple;
