import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchFetchSearchFileDetail() {
  while (true) {
    const { page, sorted, desc } = yield take(actions.fetchSearchFileDetail().type);
    const api = new API();

    yield put(commons.loadingStart());

    try {
      const { searchedItems } = yield select( state => state.fileDetailSearch );
      const payload = yield call(api.searchFilesDetail, searchedItems, page, sorted, desc);

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
