import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/tags";
import * as commonActions from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchSaveTagsOrderNumber() {
  while (true) {
    const task = yield take(actions.saveTagsOrderNumber().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      const payload = yield call(api.saveTagsOrderNumber, task.tags);
      yield put(actions.initTags(payload.data.body.tags));
      yield put(commonActions.loadingEnd());
      yield put(commonActions.triggerSnackbar("タグの並び順を保存しました"));
    }
    catch (e) {
      const { message, errors } = errorParser(e,"タグの並び順の変更に失敗しました");
      yield put(commonActions.openException(message, errors[ Object.keys(errors)[0] ]));
    } finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchSaveTagsOrderNumber;
