import * as actionTypes from "../actionTypes";

const fileSortTargetReducer = (state = { sorted: null, desc: false }, action) => {
  switch (action.type) {
  case actionTypes.SET_SORT_TARGET:
    return {
      sorted: action.sorted,
      desc: !state.desc
    };
  case actionTypes.TOGGLE_SORT_TARGET:
    return {
      sorted: state.sorted,
      desc: !state.desc
    };
  default:
    return state;
  }
};

export default fileSortTargetReducer;
