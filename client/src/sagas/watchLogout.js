import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import * as actions from "../actions";
import * as actionTypes from "../actionTypes";

function* watchLogout() {
  while (true) {
    yield take(actionTypes.LOGOUT);
    localStorage.removeItem("token");

    yield put(actions.logout());
    yield put(actions.triggerSnackbar("ログアウトしました"));
    yield call(delay, 3000);
    yield put(actions.closeSnackbar());
  }
}

export default watchLogout;
