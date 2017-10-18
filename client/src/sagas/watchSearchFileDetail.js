import { take, select } from "redux-saga/effects";
import $ from "jquery";

import { searchFileDetail } from "../actions";

function* watchSearchFileDetail() {
  while (true) {
    try {
      const { history } = yield take(searchFileDetail().type);
      console.log(history);
      const searchValues = yield select(state => state.fileDetailSearch.searchValues);

      const queryCollection = searchValues.map( search => (
        { [search._id]: search.value }
      )).map( obj => $.param(obj) ).join("&");
      
      history.push(`/files/search?${queryCollection}`);
    }
    catch (e) {
      console.log(e);
    }
  }
}

export default watchSearchFileDetail;
