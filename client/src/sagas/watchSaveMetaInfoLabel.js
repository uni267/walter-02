import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/index";
import * as commons from "../actions/commons";

function* watchSaveMetaInfoLabel() {
  while (true) {
    const { changedMetaInfo } = yield take(actions.saveMetaInfoLabel().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.saveMetainfoLabel, changedMetaInfo);

      yield put(actions.clearMetaInfoValidationErrors());
      yield put(commons.loadingEnd());
      yield put(commons.triggerSnackbar("メタ情報名を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.saveMetaInfoValidationErrors(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchSaveMetaInfoLabel;
