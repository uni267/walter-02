import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

function* watchCreateDir() {
  while (true) {
    let { dir_id, dir_name } = yield take("CREATE_DIR");
    const api = new API();
    yield put({ type: "LOADING_START" });

    try {
      if (dir_id === undefined || dir_id === null || dir_id === "") {
        dir_id = yield select( state => state.tenant.dirId );
      }

      yield call(api.createDir, dir_id, dir_name);
      const payload = yield call(api.fetchFiles, dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      yield put({ type: "TOGGLE_CREATE_DIR" });
      yield put({ type: "TRIGGER_SNACK", message: "フォルダを作成しました" });
    }
    catch (e) {
      const { errors } = e.response.data.status;
      yield put({ type: "CREATE_DIR_ERROR", errors });
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
      
  }
}

export default watchCreateDir;
