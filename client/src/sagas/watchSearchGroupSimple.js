import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/groups";
import * as commons from "../actions/commons";

function* watchSearchGroupSimple() {
  while (true) {
    const { keyword } = yield take(actions.searchGroupSimple().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.searchGroupSimple, keyword);
      yield put(actions.initGroups(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSearchGroupSimple;
