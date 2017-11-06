import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/menus";
import * as commons from "../actions/commons";


function* watchCreateRoleMenu() {
  while (true) {
    const task = yield take(actions.createRoleMenu().type);
    const api = new API();
    yield put(actions.clearRoleMenuValidationError());

    try {
      yield put(commons.loadingStart());
      yield call(api.createRoleMenu, task.roleMenu);

      const payload = yield call(api.fetchRoleMenus);
      yield put(actions.initRoleMenus(payload.data.body));

      yield put(commons.loadingEnd());
      yield task.history.push("/role_menus");
      yield put(commons.triggerSnackbar("ロールを作成しました"));
    }
    catch (e) {
      console.log(e);
      const { errors } = e.response.data.status;
      yield put(actions.saveRoleMenuValidationError(errors));
      yield put(commons.loadingEnd());
    }
  }
}

export default watchCreateRoleMenu;
