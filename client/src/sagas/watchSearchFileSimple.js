import { put, take, call, select, race } from "redux-saga/effects";
import { delay } from "redux-saga";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";
import { LIST_SEARCH_SIMPLE } from "../constants/index";

function* watchSearchFileSimple() {
  while (true) {
    const { value, history } = yield take(actionTypes.SEARCH_FILE_SIMPLE);

    const api = new API();
    yield put(commons.loadingStart());

    try {
      const { list_type } = yield select(state => state.fileListType);

      if(list_type !== LIST_SEARCH_SIMPLE ){
        yield put(actions.initFilePagination());
        yield put(actions.clearFiles());
        yield put(actions.setFileListType(LIST_SEARCH_SIMPLE));
      }

      const { search_value:old_value } = yield select(state => state.fileSimpleSearch);
      if(old_value !== undefined && old_value.value !== value) {
        yield put(actions.initFilePagination());
        yield put(actions.clearFiles());
      }

      const { page } = yield select( state => state.filePagination );
      const { sorted, desc } = yield select( state => state.fileSortTarget );

      const payload = yield call(api.searchFiles, value, page, sorted, desc);

      yield put(actions.keepFileSimpleSearchValue({value, page, sorted, desc}));

      if (page === 0 || page === null ) {
        yield put(actions.initFileTotal(payload.data.status.total));
        yield put(actions.initFiles(payload.data.body));
      }
      else {
        yield put(actions.initNextFiles(payload.data.body));
      }

      history.push("/files/search");
    }
    catch(e) {
      if(e.response === undefined){
        yield put(commons.openException("一覧の取得に失敗しました"));
      }else{
        const { message, errors } = e.response.data.status;

        if (!errors.q) {
          yield put(commons.openException(message, JSON.stringify(errors)));
        }
      }
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSearchFileSimple;
