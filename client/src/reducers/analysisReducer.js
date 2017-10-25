import * as actionTypes from "../actionTypes";

const initialState = {
  useRateTotal: [],
  fileCount: [],
  folderCount: [],
  useRateFolder: [],
  useRateTag: [],
  useRateMimeType: [],
  useRateUser: [],
  usages: []
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
