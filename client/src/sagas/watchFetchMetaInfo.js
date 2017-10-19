import { call, put, take } from "redux-saga/effects";

import * as actions from "../actions";
import { API } from "../apis";

function* watchFetchMetaInfo() {
  while (true) {
    const { meta_id } = yield take(actions.requestFetchMetaInfo().type);
    const api = new API();

    yield put(actions.loadingStart());

    try {
      const payload = yield call(api.fetchMetaInfo, meta_id);
      yield put(actions.initMetaInfo(payload.data.body));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchFetchMetaInfo;
