import * as actionTypes from "../actionTypes";

export const requestFetchAnalysis = (reported_at) => ({
  type: actionTypes.REQUEST_FETCH_ANALYSIS, reported_at
});

export const initAnalysis = (analysis) => ({
  type: actionTypes.INIT_ANALYSIS, analysis
});
