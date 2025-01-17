import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";

import { isDisplayUnvisibleSetting } from "./watchToggleDisplayUnvisibleFiles";

import { saveAs } from "file-saver";

function* watchDownloadXlsxFileDetail() {
  while (true) {
    yield take(actions.downloadXlsxFileDetail().type);
    const api = new API();

    // 非表示ファイルを取得するか
    const isDisplayUnvisible = yield call(isDisplayUnvisibleSetting);

    try {
      const { searchedItems } = yield select( state => state.fileDetailSearch );
      const { page } = yield select( state => state.filePagination );
      const { sorted, desc } = yield select( state => state.fileSortTarget );

      yield put(commons.loadingStart());
      const payload = yield call(api.downloadXlsxFileDetail, searchedItems, page, sorted, desc, isDisplayUnvisible);

      const download = new Blob(
        [ payload.data ]
        );

        yield saveAs(download, "list.xlsx");
      }
    catch (e) {
      yield put(commons.openException("ファイルのダウンロードに失敗しました"));
    }
    finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDownloadXlsxFileDetail;
