import { call, put, take, select } from "redux-saga/effects";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchToggleAutoTimestamp() {
  while (true) {
    const { dir, enable } = yield take(actions.toggleAutoTimestamp().type);
    const api = new API();

    try {
      const { data: { body: { meta_info }}} = enable
          ? yield call(api.enableAutoGrantTimestamp, dir._id)
          : yield call(api.disableAutoGrantTimestamp, dir._id)

      if (meta_info && meta_info.name === "auto_grant_timestamp") {
        const meta_infos = dir.meta_infos.length > 0 ? dir.meta_infos.map(m => m.name === "auto_grant_timestamp" ? meta_info : m ) : [meta_info]
        const updateDir = { ...dir, meta_infos }
        yield put(actions.updateFileRow(updateDir))

        const finishMessage = enable ? "タイムスタンプ自動発行を有効にしました" : "タイムスタンプ自動発行を無効にしました"
        yield put(commons.triggerSnackbar(finishMessage))
      }
    }
    catch (e) {
      const { message, errors } = errorParser(e,"フォルダの削除に失敗しました");
      if(!errors.unknown){
        yield put(commons.openException(message, JSON.stringify(errors)));
      }else{
        yield put(commons.openException(message, errors.unknown ));
      }
    }
  }
}

export default watchToggleAutoTimestamp;
