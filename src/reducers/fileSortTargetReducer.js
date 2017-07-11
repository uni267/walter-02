const fileSortTargetReducer = (state = { sorted: null, desc: false }, action) => {
  switch (action.type) {
  case "SET_SORT_TARGET":
    return {
      sorted: action.sorted,
      desc: !state.desc
    };
  case "TOGGLE_SORT_TARGET":
    return {
      sorted: state.sorted,
      desc: !state.desc
    };
  default:
    return state;
  }
};

export default fileSortTargetReducer;
