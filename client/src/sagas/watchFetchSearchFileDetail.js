import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchFetchSearchFileDetail() {
  while (true) {
    const { params, page, sorted, desc } = yield take(
      actionTypes.FETCH_SEARCH_FILE_DETAIL
    );
    const api = new API();

    yield put(commons.loadingStart());
    yield call(delay, 1000);

    try {
      const payload = yield call(api.searchFilesDetail, params, page, sorted, desc);

      if (page === 0 || page === null) {
        const { total } = payload.data.status;
        yield put(actions.initFileTotal(total));
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

export default watchFetchSearchFileDetail;
