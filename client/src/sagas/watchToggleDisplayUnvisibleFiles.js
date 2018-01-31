import { call, put, take, all, select } from "redux-saga/effects";
import * as _ from "lodash";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import { fetchFiles } from "./watchFetchFiles";
import errorParser from "../helper/errorParser";

function* watchToggleDisplayUnvisibleFiles() {
  while(true) {
    const task = yield take( actions.toggleDisplayUnvisibleFiles().type );
    yield put(actions.toggleDisplayUnvisibleFiles(task.checked));
    yield put(commons.loadingStart());

    const dir = _.last(yield select( state => state.dirs ));

    try {
      yield call(fetchFiles, dir._id, 0); // トグルした場合は1ページから表示するので
    }
    catch (e) {
      console.log(e);
      const { message, errors } = errorParser(e,"一覧の取得に失敗しました");
      if (!errors.unknown) {
        yield put(commons.openException(message, errors[ Object.keys(errors)[0] ]));
      } else {
        yield put(commons.openException(message, errors.unknown ));
      }
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchToggleDisplayUnvisibleFiles;
