import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchSaveUserAccountName() {
  while (true) {
    const { user } = yield take(actions.saveUserAccountName().type);
    const api = new API();
    yield put(actions.clearUserValidationError());

    try {
      yield put(commonActions.loadingStart());
      yield call(api.saveUserAccountName, user);
      const payload = yield call(api.fetchUser, user._id);
      yield put(actions.initUser(payload.data.body));
      yield put(commonActions.loadingEnd());
      yield put(commonActions.triggerSnackbar("アカウント名を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.changeUserValidationError(errors));
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchSaveUserAccountName;
