const initialState = {
  start: false
};

const loadingReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "LOADING_START":
    return {...state, start: true};
  case "LOADING_END":
    return {...state, start: false};
  default:
    return state;
  }
};

export default loadingReducer;
