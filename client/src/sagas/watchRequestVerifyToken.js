import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

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
      yield put(actions.requestFetchAuthorityMenus());
      yield put(actions.requestLoginSuccess("success", user));
      yield put(actions.loadingEnd());
    }
    catch (e) {
      const { message, errors } = errorParser(e,"トークン認証に失敗しました");
      if(!errors.unknown){
        yield put(commons.openException(message, errors[ Object.keys(errors)[0] ]));
      }else{
        yield put(commons.openException(message, errors.unknown ));
      }
      localStorage.removeItem("token");
      yield call(delay, 2000);
      window.location.href = localStorage.getItem("tenant_name") + "/login";
    }
  }
}

export default watchRequestVerifyToken;
