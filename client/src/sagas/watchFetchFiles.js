import { call, put, take, all, select } from "redux-saga/effects";

// api
import { API } from "../apis";

// actions
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

export function* fetchFiles(dir_id, page, sorted, desc) {
  const api = new API();

  // 非表示ファイルを取得するか
  const isDisplayUnvisibleSetting = yield select( state => {
    return state.appSettings.find( s => s.name === "unvisible_files_toggle" );
  });

  let isDisplayUnvisible;

  if (isDisplayUnvisibleSetting) {
    isDisplayUnvisible = isDisplayUnvisibleSetting.value;
  } else {
    const settingsPayload = yield call(api.fetchAppSettings);
    const settings = settingsPayload.data.body;
    isDisplayUnvisible = settings.find( s => s.name === "unvisible_files_toggle" ).default_value;
  }

  if (page === 0 || page === null) {

    let files, dirs;

    const { sorted, desc } = yield select( state => state.fileSortTarget );

    if (sorted === null) {
      let defaultSort = yield call(api.fetchDisplayItems);
      defaultSort = defaultSort.data.body.filter( item => item.default_sort );

      defaultSort = defaultSort.length > 0 ? defaultSort[0] : null;

      [ files, dirs ] = yield all([
        call(api.fetchFiles, dir_id, page, defaultSort.meta_info_id, defaultSort.default_sort.desc, isDisplayUnvisible),
        call(api.fetchDirs, dir_id),
        put(actions.setSortTarget(defaultSort.meta_info_id))
      ]);
    }
    else {
      [ files, dirs ] = yield all([
        call(api.fetchFiles, dir_id, page, sorted, desc, isDisplayUnvisible),
        call(api.fetchDirs, dir_id)
      ]);
    }

    yield put(actions.initFileTotal(files.data.status.total));
    yield put(actions.initFiles(files.data.body));
    yield put(actions.initDir(dirs.data.body));

  }
  else {
    const files = yield call(api.fetchFiles, dir_id, page, sorted, desc, isDisplayUnvisible);
    yield put(actions.initNextFiles(files.data.body));
  }
}

export function* watchFetchFiles() {
  while (true) {
    let { dir_id, page, sorted, desc } = yield take( actions.requestFetchFiles().type );

    yield put(commons.loadingStart());

    try {
      yield call(fetchFiles, dir_id, page, sorted, desc);
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

// export default watchFetchFiles;
