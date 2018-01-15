import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchFetchDirTree() {
  while (true) {
    const { root_id } = yield take("REQUEST_FETCH_DIR_TREE");
    const api = new API();
    yield put({ type: "LOADING_FETCH_DIR_TREE" });
    yield put({ type: "LOADING_START" });

    try {
      const payload = yield call(api.fetchDirTree, root_id);
      yield put({ type: "PUT_DIR_TREE", node: payload.data.body });
    }
    catch (e) {
      const { message, errors } = errorParser(e,"フォルダ一覧の取得に失敗しました");
      if(!errors.unknown){
        yield put(commons.openException(message, errors[ Object.keys(errors)[0] ]));
      }else{
        yield put(commons.openException(message, errors.unknown ));
      }
    }
    finally {
      yield put({ type: "LOADING_END" });
    }

  }
}

export default watchFetchDirTree;
