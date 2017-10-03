import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions";

function* watchCreateUser() {
  while (true) {
    const task = yield take(actions.createUser().type);
    const api = new API();    

    try {
      yield put(actions.loadingStart());
      yield call(delay, 1000);
      yield call(api.createUser, task.user);
      const payload = yield call(api.fetchUsers, localStorage.getItem("tenantId"));
      yield put(actions.initUsers(payload.data.body));
      yield put(actions.loadingEnd());
      yield task.history.push("/users");
      yield put(actions.triggerSnackbar("ユーザを作成しました"));
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(actions.changeUserValidationError(errors));
      yield put(actions.loadingEnd());
    }
  }
}

export default watchCreateUser;
