import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import {
  searchFileDetail,
  initFiles,
  initDir,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSearchFileDetail() {
  while (true) {
    yield take(searchFileDetail().type);
    const api = new API();
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const searchValues = yield select(state => state.fileDetailSearch.searchValues);

      const searchParams = Object.assign(
        ...searchValues.map(v => ({ [v._id]: { ...v } }))
      );

      const payload = yield call(api.searchFilesDetail, searchParams);
      yield put(initFiles(payload.data.body));

      const { dirId } = yield select(state => state.tenant);
      const dirs = [
        { _id: dirId, name: "検索結果" }
      ];

      yield put(initDir(dirs));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSearchFileDetail;
