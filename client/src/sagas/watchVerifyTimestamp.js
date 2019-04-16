import { call, put, take } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commonActions from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchVerifyTimestamp() {
  while (true) {
    const { file } = yield take(actions.verifyTimestamp().type);
    const api = new API();
    yield put(commonActions.loadingStart());

    try {
      const { data: { body: { meta_info }}} = yield call(api.verifyTimestamp, file._id);

      if (meta_info && meta_info.name === "timestamp") {
        const updateFile = {
          ...file, meta_infos: file.meta_infos.map(m => m.name === "timestamp" ? meta_info : m )
        }
        yield put(actions.updateFileRow(updateFile))
        yield put(actions.updateTimestampTargetFile(updateFile))
      }
    }
    catch (e) {
      const { message, errors } = errorParser(e,"タイムスタンプの検証に失敗しました");
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

export default watchVerifyTimestamp;
