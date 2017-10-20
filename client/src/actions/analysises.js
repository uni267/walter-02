import * as actionTypes from "../actionTypes";

export const requestFetchAnalysis = (tenant_id) => ({
  type: actionTypes.REQUEST_FETCH_ANALYSIS, tenant_id
});

export const initAnalysis = (analysis) => ({
  type: actionTypes.INIT_ANALYSIS, analysis
});
