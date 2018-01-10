import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// action
import * as actions from "../actions";
import * as actionTypes from "../actionTypes";
import * as commons from "../actions/commons";

function* watchLogin() {
  while (true) {
    const { account_name, password } = yield take(actionTypes.REQUEST_LOGIN);
    const api = new API();
    yield put(actions.loadingStart());

    try {
      const tenant_name = localStorage.getItem("tenant_name");
      const payload = yield call(api.login, account_name, password, tenant_name);
      const { user, token } = payload.data.body;
      localStorage.setItem("token", token);
      const { _id, name, home_dir_id, trash_dir_id } = user.tenant;
      yield put(actions.putTenant(_id, name, home_dir_id, trash_dir_id));
      yield put(actions.requestLoginSuccess("success", user._id));
    }
    catch (e) {
      const { message, errors } = e.response.data.status;
      if (errors.tenant_name) {
        yield put(commons.openException(message, JSON.stringify(errors)));
      }
      else {
        yield put(actions.requestLoginFailed(message, errors));
      }
    }
    finally {
      yield put(actions.loadingEnd());
    }
  }
}

export default watchLogin;
