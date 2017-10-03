import * as actionTypes from "../actionTypes";

const initialState = {
  rate: [],
  usage: [],
  file_count: []
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
