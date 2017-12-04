import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { saveAs } from "file-saver";

function* watchDownloadXlsxFileSimple() {
  while (true) {
    yield take(actions.downloadXlsxFileSimple().type);
    const api = new API();

    try {
      const { value } = yield select( state => state.fileSimpleSearch.search_value );
      const { page } = yield select( state => state.filePagination );
      const { sorted, desc } = yield select( state => state.fileSortTarget );

      yield put(commons.loadingStart());
      const payload = yield call(api.downloadXlsxFileSimple, value, page, sorted, desc);

      const download = new Blob(
        [ payload.data ]
        );

        yield saveAs(download, "list.xlsx");
      }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDownloadXlsxFileSimple;
