import { call, put, take } from "redux-saga/effects";
import * as _ from "lodash";

import { API } from "../apis";

import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

function* watchDeleteAuthorityToFile() {
  while (true) {
    const { file, user, group, role } = yield take(
      actions.deleteAuthorityToFile().type
    );

    const api = new API();
    yield put(commons.loadingStart());

    try {
      const target = {};

      if (user !== undefined && user !== null) {
        yield call(api.deleteAuthorityToFile, file, user, role, "user");
      } else if (group !== undefined && group !== null) {
        yield call(api.deleteAuthorityToFile, file, group, role, "group");
      } else {
        throw new Error("user or group is invalid");
      }

      const payload = yield call(api.fetchFile, file._id);
      yield put(actions.initFile(payload.data.body));
      yield put(commons.triggerSnackbar("権限を削除しました"));
    }
    catch (e) {
      if(_.get(e, 'response.data.status.errors.name') === 'PermisstionDeniedException'){
        yield put(commons.openException("操作権限がありません", '' ));
        // 読取権限すらないことが想定されるため、「権限を変更」ダイアログを消して一覧もリフレッシュ。
        window.location.reload();
      }else{
        const { message, errors } = errorParser(e,"権限の削除に失敗しました");
        if(!errors.unknown){
          yield put(commons.openException(message, JSON.stringify(errors)));
        }else{
          yield put(commons.openException(message, errors.unknown ));
        }
      }
    } finally {
      yield put(commons.loadingEnd());
    }
  }
}

export default watchDeleteAuthorityToFile;
