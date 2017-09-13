import { delay } from "redux-saga";
import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import {
  searchFileDetail,
  initFiles,
  loadingStart,
  loadingEnd
} from "../actions";

function* watchSearchFileDetail() {
  while (true) {
    const task = yield take(searchFileDetail().type);
    yield put(loadingStart());

    try {
      yield call(delay, 1000);
      const searchValues = yield select(state => state.fileDetailSearch.searchValues);

      const searchParams = Object.assign(
        ...searchValues.map(v => ({ [v._id]: { ...v } }))
      );

      const payload = yield call(API.searchFilesDetail, searchParams);
      yield put(initFiles(payload.data.body));
    }
    catch (e) {

    }
    finally {
      yield put(loadingEnd());
    }
  }
}

export default watchSearchFileDetail;
