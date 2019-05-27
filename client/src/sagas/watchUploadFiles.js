import { call, put, take, all } from "redux-saga/effects";
import MD5 from "crypto-js/md5";
import * as actions from "../actions/files";
import * as commons from "../actions/commons";
import errorParser from "../helper/errorParser";

import { API_STREAM,API } from "../apis";
import axios from "axios";

//chank send sample
/*moved to api
function uploadChank(blob, name, size, type, lastModified ,md5, dir_id){
  const base64FileName = btoa(unescape(encodeURIComponent(name)));
  console.log(base64FileName);

  axios.create({
    responseType: 'application/arraybuffer',
    headers: {
      "X-Cloud-Storage-Use-Stream": "1",
      "X-Auth-Cloud-Storage": localStorage.getItem("token"),
      "X-File-Name": base64FileName,
      "X-File-Size": size,
      "X-File-Mime-type": type,
      "X-File-modified": lastModified,
      "x-File-checksum": md5,
      "X-File-UUID": `${name}-${size}-${type}-${lastModified}`,
      "X-Dir-Id": dir_id
    }
  });

  return axios.post("/api/v1/files/binary",blob);
}
*/

function chunk(file, i, chunkSize){
  let reader = new FileReader();
  const start = i * chunkSize;
  const stop = start + chunkSize;
  let blob = file.slice(start, stop);
  return new Promise((resolve, reject) => {
    reader.onloadend = function(e){
      if (e.target.readyState === FileReader.DONE) {
        let blobf = e.target.result;
        resolve({blob: reader.result, file: file, index:i});
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}
function sendFile(file){
  const chunkSize =  1024 * 1000 * 5;
  const chunks = Math.ceil(file.size / chunkSize);
  for (let i = 0; i < chunks; i++) {
    chunk(file, i, chunkSize);
  }
}

function* watchUploadFiles() {
  while (true) {
    const { dir_id, files, disableFileBuffer } = yield take(actions.uploadFiles().type);
    const api = new API();
    yield put(commons.loadingStart());

    try {
      // const uploadPayload = yield call(api.filesUpload, dir_id, files);

      // fileのパース yieldでコールするのでpromiseでラップしておく
      // const readFile = file => {
      //   sendFile(file);
      //   return new Promise( (resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.readAsArrayBuffer(file);
      //     reader.onload = e => {
      //       resolve(reader.result);
      //       // resolve({
      //       //   name: file.name,
      //       //   size: file.size,
      //       //   mime_type: file.type,
      //       //   modified: file.lastModified,
      //       //   base64: reader.result,
      //       //   checksum: MD5(reader.result).toString()
      //       // });
      //     };
      //   });
      // };

      // const _files = yield all(files.map( f => readFile(f) ));
      let uploadPayload;

      for(var i = 0; i < files.length; i++) {
        const apiStream = new API_STREAM();
        const chunkSize = 1024 * 1000 * 5;
        const chunks = Math.ceil(files[i].size / chunkSize);
        for (var j = 0; j < chunks; j++) {
          const result = yield chunk(files[i], j, chunkSize);
          const { blob, file, index } = result;
          const payload = yield apiStream.uploadChank(
            blob, file.name, file.size, file.type, file.lastModified, MD5(blob).toString(), dir_id
          );
          if (payload.data) {
            uploadPayload = payload;
          }
          // if (payload.data.body.finish !== false) {
          //   uploadPayload.push(payload);
          // }
          // chunk(files[i], j, chunkSize).then( result => {
          //   console.log(result);
          //   const {blob, file, index} = result;
          //   return apiStream.uploadChank(blob, file.name, file.size, file.type, file.lastModified, MD5(blob).toString(), dir_id);
          // }).then( (res) => {
          //   console.log(res);
          // });
        }
      }


      // const uploadPayload = yield call(apiStream.filesUploadStream, _files);
      // const uploadPayload = yield call(api.filesUploadBlob, dir_id, _files);

      if (!disableFileBuffer) {
        // アップロードダイアログの一覧を更新
        const buffers = uploadPayload.data.body.map( body => (
          put(actions.pushFileToBuffer(body))
        ));

        yield all(buffers);
      }

      // ファイル一覧の先頭に追加
      yield put(actions.insertFileRow(uploadPayload.data.body));

      const toggleCheckTasks = uploadPayload.data.body.map( file => put(actions.toggleFileCheck(file)) );

      yield all(toggleCheckTasks);
      yield put(commons.triggerSnackbar("ファイルをアップロードしました"));
    }
    catch (e) {
      console.log(e);
      const { message, errors } = errorParser(e,"ファイルのアップロードに失敗しました。");
      yield put(commons.openException(message, errors[ Object.keys(errors)[0] ]));
    }
    finally {
      yield put(commons.loadingEnd());
    }

  }
}

export default watchUploadFiles;
