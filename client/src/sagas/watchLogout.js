import { put, take } from "redux-saga/effects";

function* watchLogout() {
  while (true) {
    yield take("LOGOUT");
    localStorage.removeItem("token");

    yield put({ type: "LOGOUT" });
    yield put({ type: "TRIGGER_SNACK", message: "ログアウトしました" });
  }
}

export default watchLogout;
