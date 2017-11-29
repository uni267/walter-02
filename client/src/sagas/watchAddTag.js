import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";

function* watchAddTag() {
  while (true) {
    const { file, tag } = yield take(actions.requestAddTag().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      yield call(api.fetchAddTag, file, tag);

      // ソート、ページネーションの状態を保持する
      const { sorted, desc } = yield select( state => state.fileSortTarget );
      const { page } = yield select( state => state.filePagination );
      const payload = yield call(api.fetchFiles, file.dir_id, page, sorted, desc);
      yield put(actions.initFiles(payload.data.body));

      // タグ編集ダイアログ用のfile objectをセット
      const changedFile = payload.data.body.filter( _file => _file._id === file._id );
      yield put(actions.initFileTag(changedFile[0]));
      yield put(commons.triggerSnackbar("タグを追加しました"));
    }
    catch (e) {
      console.log(e);
    }
    finally {
      yield put(commons.loadingEnd());
    }
      
  }
}

export default watchAddTag;
