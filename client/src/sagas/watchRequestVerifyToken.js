import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";

function* watchRequestVerifyToken() {
  while (true) {
    const { token } = yield take(actions.requestVerifyToken().type);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      const payload = yield call(api.verifyToken, token);
      const { user } = payload.data.body;
      const { _id, name, home_dir_id, trash_dir_id } = user.tenant;
      yield put(actions.putTenant(_id, name, home_dir_id, trash_dir_id));
      yield put(actions.requestLoginSuccess("success", user._id));
      yield put(actions.loadingEnd());
    }
    catch (e) {

    }
  }
}

export default watchRequestVerifyToken;
