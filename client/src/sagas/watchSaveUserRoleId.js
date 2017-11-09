import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/users";
import * as commonActions from "../actions/commons";

function* watchSaveUserRoleId() {
  while (true) {
    const task = yield take(actions.saveUserRoleId().type);
    const api = new API();
    yield put(actions.clearUserValidationError());

    try {
      yield put(commonActions.loadingStart());
      yield call(api.saveUserRoleId, task.user);
      const payload = yield call(api.fetchUser, task.user._id);
      yield put(actions.initUser(payload.data.body));
      yield put(commonActions.loadingEnd());
      yield put(commonActions.triggerSnackbar("ユーザー種類を変更しました"));
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put(actions.changeUserValidationError(errors));
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchSaveUserRoleId;
