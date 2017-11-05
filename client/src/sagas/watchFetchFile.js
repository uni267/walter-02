import { call, put, take } from "redux-saga/effects";

// api
import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchFetchFile() {

  while (true) {
    const { file_id } = yield take(actions.requestFetchFile().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      const payload = yield call(api.fetchFile, file_id);
      yield put(actions.initFile(payload.data.body));
    }
    catch (e) {
      const { message, name } = e.response.data.status.errors;
      yield put(commons.openException(name, message));
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }

}

export default watchFetchFile;
