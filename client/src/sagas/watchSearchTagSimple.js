import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";

function* watchSearchTagSimple() {
  while (true) {
    const { keyword } = yield take(actions.searchTagSimple().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      const payload = yield call(api.searchTagSimple, keyword);
      yield put(actions.initTags(payload.data.body));      
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchSearchTagSimple;
