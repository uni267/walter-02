import { call, take, select, put } from "redux-saga/effects";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { API } from "../apis";
import { LIST_SEARCH_DETAIL } from "../constants/index";

import { isMatch } from "lodash";

function* watchSearchFileDetail() {
  while (true) {
    try {

      const { list_type } = yield select(state => state.fileListType);
      if(list_type !== LIST_SEARCH_DETAIL ){
        yield put(actions.initFilePagination());
        yield put(actions.setFileListType(LIST_SEARCH_DETAIL));
      }

      const { searchedItems:old_items } = yield select( state => state.fileDetailSearch );
      const { history, items } = yield take(actions.searchFileDetail().type);

      if( !isMatch(old_items,items) ){
        yield put(actions.initFilePagination());
        yield put(actions.clearFiles());
      }

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
