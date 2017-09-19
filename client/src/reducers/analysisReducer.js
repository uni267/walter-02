const initialState = [];

const analysisReducer = (state = initialState, action) => {
  switch (action.type) {
  case "INIT_ANALYSIS":
    return action.analysis;
  default:
    return state;
  }
};

export default analysisReducer;
