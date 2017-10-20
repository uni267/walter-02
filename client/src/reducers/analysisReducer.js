import * as actionTypes from "../actionTypes";

const initialState = {
  totals: [],
  folders: [],
  usages: [],
  file_count: [],
  users: [],
  mimetypes: [],
  tags: [],
  fileCount: [],
  folderCount: []
};

const analysisReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.INIT_ANALYSIS:
    return action.analysis;
  default:
    return state;
  }
};

export default analysisReducer;
