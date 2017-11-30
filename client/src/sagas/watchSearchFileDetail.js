import { call, take, select, put } from "redux-saga/effects";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";

function* watchSearchFileDetail() {
  while (true) {
    try {
      const { history, items } = yield take(actions.searchFileDetail().type);

      yield put(commons.loadingStart());
      const api = new API();
      const { page } = yield select( state => state.filePagination );
      const { sorted, desc } = yield select( state => state.fileSortTarget );

      const payload = yield call(api.searchFilesDetail, items, page, sorted, desc);

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

export default watchSearchFileDetail;
