import { take } from "redux-saga/effects";

import * as actionTypes from "../actionTypes";

function* watchSearchFileSimple() {
  while (true) {
    const { value, history } = yield take(actionTypes.SEARCH_FILE_SIMPLE);
    if (value) {
      const queryCollection = value
            .replace(/\u3000/g, " ")
            .split(" ")
            .join("+");

      history.push(`/files/search?q=${queryCollection}`);
    } else {
      history.push(`/files/search`);
    }
  }
}

export default watchSearchFileSimple;
