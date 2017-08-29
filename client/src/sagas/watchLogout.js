import { delay } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

function* watchLogout() {
  while (true) {
    const task = yield take("LOGOUT");
    localStorage.removeItem("userId");
    localStorage.removeItem("tenantName");
    localStorage.removeItem("dirId");
    localStorage.removeItem("token");
    localStorage.removeItem("trashDirId");

    yield put({ type: "LOGOUT" });
    yield put({ type: "TRIGGER_SNACK", message: "ログアウトしました" });
  }
}

export default watchLogout;
