import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// action
import * as actions from "../actions";
import * as actionTypes from "../actionTypes";

function* watchLogin() {
  while (true) {
    const { account_name, password } = yield take(actionTypes.REQUEST_LOGIN);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      const payload = yield call(api.login, account_name, password);
      const { user, token } = payload.data.body;
      localStorage.setItem("token", token);
      const { _id, name, home_dir_id, trash_dir_id } = user.tenant;
      yield put(actions.putTenant(_id, name, home_dir_id, trash_dir_id));
      yield put(actions.requestLoginSuccess("success", user._id));
    }
    catch (e) {
      const { message, errors } = e.response.data.status;
      yield put(actions.requestLoginFailed(message, errors));
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchLogin;
