import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchCreateMetaInfo() {
  while (true) {
    const { metaInfo, history } = yield take(actionTypes.CREATE_META_INFO);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(delay, 1000);
      yield call(api.createMetaInfo, metaInfo);
      const payload = yield call(api.fetchMetaInfos);
      yield put(actions.initMetaInfos(payload.data.body));
      yield history.push("/meta_infos");
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("メタ情報を作成しました"));
      yield call(delay, 3000);
      yield put(commons.closeSnackbar());
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveMetaInfoValidationErrors(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchCreateMetaInfo;
