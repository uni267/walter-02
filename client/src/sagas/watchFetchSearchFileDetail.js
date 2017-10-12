import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions";
import * as actionTypes from "../actionTypes";

function* watchFetchSearchFileDetail() {
  while (true) {
    const { params, page } = yield take(actionTypes.FETCH_SEARCH_FILE_DETAIL);
    const api = new API();

    yield put(actions.loadingStart());
    yield call(delay, 1000);

    try {
      const payload = yield call(api.searchFilesDetail, params, page);
      const { total } = payload.data.status;
      yield put(actions.initFileTotal(total));

      if ( page > 0 ) {
        const files = yield select( state => state.files );
        yield put(actions.initFiles(files.concat(payload.data.body)));
      }
      else {
        yield put(actions.initFiles(payload.data.body));
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchSearchFileDetail;
