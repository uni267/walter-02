import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commonActions from "../actions/commons";
import errorParser from "../helper/errorParser";
import { saveAs } from "file-saver";

function* watchDownloadTimestampToken() {
  while (true) {
    const { file } = yield take(actions.downloadTimestampToken().type);
    const api = new API();

    try {
      yield put(commonActions.loadingStart());

      const payload = yield call(api.downloadTimestampToken, file._id);
      const download = new Blob([ payload.data ]);
      yield saveAs(download, file.name + ".timestamp_token");
    }
    catch (e) {
      const { message, errors } = errorParser(e,"タイムスタンプのダウンロードに失敗しました");
      if(!errors.unknown){
        yield put(commonActions.openException(message, errors[ Object.keys(errors)[0] ]));
      }else{
        yield put(commonActions.openException(message, errors.unknown ));
      }
    }
    finally {
      yield put(commonActions.loadingEnd());
    }
  }
}

export default watchDownloadTimestampToken;
