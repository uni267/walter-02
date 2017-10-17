import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchFetchSearchFileSimple() {
  while (true) {
    const { value, page, sorted, desc } = yield take(
      actionTypes.FETCH_SEARCH_FILE_SIMPLE
    );

    const api = new API();

    yield put(commons.loadingStart());
    yield call(delay, 1000);

    try {
      const payload = yield call(api.searchFiles, value, page, sorted, desc);

      if (page === 0 || page === null) {
        yield put(actions.initFileTotal(payload.data.status.total));        
        yield put(actions.initFiles(payload.data.body));
      }
      else {
        yield put(actions.initNextFiles(payload.data.body));
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchFetchSearchFileSimple;
