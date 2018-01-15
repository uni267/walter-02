import { call, put, take, all, select } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import * as actionTypes from "../actionTypes";
import errorParser from "../helper/errorParser";

function* watchFetchFiles() {
  while (true) {
    let { dir_id, page, sorted, desc } = yield take( actions.requestFetchFiles().type );

    const api = new API();
    yield put(commons.loadingStart());

    try {
      if (page === 0 || page === null) {

        let files, dirs;

        const { sorted, desc } = yield select( state => state.fileSortTarget );

        if (sorted === null) {
          let defaultSort = yield call(api.fetchDisplayItems);
          defaultSort = defaultSort.data.body.filter( item => item.default_sort );

          defaultSort = defaultSort.length > 0 ? defaultSort[0] : null;

          [ files, dirs ] = yield all([
            call(api.fetchFiles, dir_id, page, defaultSort.meta_info_id, defaultSort.default_sort.desc),
            call(api.fetchDirs, dir_id),
            put(actions.setSortTarget(defaultSort.meta_info_id))
          ]);
        }
        else {
          [ files, dirs ] = yield all([
            call(api.fetchFiles, dir_id, page, sorted, desc),
            call(api.fetchDirs, dir_id)
          ]);
        }

        yield put(actions.initFileTotal(files.data.status.total));
        yield put(actions.initFiles(files.data.body));
        yield put(actions.initDir(dirs.data.body));

      }
      else {
        const files = yield call(api.fetchFiles, dir_id, page, sorted, desc);
        yield put(actions.initNextFiles(files.data.body));
      }
    }
    catch (e) {
      const { message, errors } = errorParser(e,"一覧の取得に失敗しました");
      if(!errors.unknown){
        yield put(commons.openException(message, errors[ Object.keys(errors)[0] ]));
      }else{
        yield put(commons.openException(message, errors.unknown ));
      }
    }
    finally {
      yield put(commons.loadingEnd());
    }

  }
}

export default watchFetchFiles;
