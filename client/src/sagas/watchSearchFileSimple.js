import { put, take, call, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchSearchFileSimple() {
  while (true) {
    const { value, history } = yield take(actionTypes.SEARCH_FILE_SIMPLE);

    const api = new API();
    yield put(commons.loadingStart());

    try {
      const { page } = yield select( state => state.filePagination );
      const { sorted, desc } = yield select( state => state.fileSortTarget );

      const payload = yield call(api.searchFiles, value, page, sorted, desc);
      yield put(actions.keepFileSimpleSearchValue({value, page, sorted, desc}));

      if (page === 0 || page === null) {
        yield put(actions.initFileTotal(payload.data.status.total));
        yield put(actions.initFiles(payload.data.body));
      }
      else {
        yield put(actions.initNextFiles(payload.data.body));
      }

      history.push("/files/search");
    }
    catch(e) {
      const { message, errors } = e.response.data.status;
      if (! errors.q) {
        yield put(commons.openException(message, JSON.stringify(errors)));
      }
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSearchFileSimple;
