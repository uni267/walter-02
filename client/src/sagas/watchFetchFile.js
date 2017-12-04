import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchFetchFile() {

  while (true) {
    const { file_id, history } = yield take(actions.requestFetchFile().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchFile, file_id);
      if (payload.data.body.is_dir) {
        throw "id is not file";
      }

      yield put(actions.initFile(payload.data.body));
    }
    catch (e) {
      if (e === "id is not file") {
        yield put(commons.openException("指定されたファイルIDが不正です", "トップページにジャンプします"));
        history.push("/home");
      }
      else {
        const { message, name } = e.response.data.status.errors;
        yield put(commons.openException(name, message));
        history.push("/home");
      }
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }

}

export default watchFetchFile;
