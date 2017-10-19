import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";
import * as actions from "../actions";

function* watchEditFileByIndex() {
  while (true) {
    const { file } = yield take("EDIT_FILE_BY_INDEX");
    const api = new API();

    try {
      yield put({ type: "LOADING_START" });
      yield call(api.editFile, file);
      const payload = yield call(api.fetchFiles, file.dir_id);
      yield put({ type: "INIT_FILES", files: payload.data.body });
      yield put(actions.triggerSnackbar("ファイル名を変更しました"));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put({ type: "LOADING_END" });
    }
  }
}

export default watchEditFileByIndex;
