import { put, take } from "redux-saga/effects";

// import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";

function* watchCopyFile() {
  while (true) {
    // const { dir_id, file } = yield take(actionTypes.COPY_FILE);
    yield take(actionTypes.COPY_FILE);
    yield put(commons.loadingStart());

    try {
      yield put(actions.toggleCopyFileDialog());
    }
    catch (e) {
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchCopyFile;
