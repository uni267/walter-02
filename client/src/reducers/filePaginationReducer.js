import * as actionTypes from "../actionTypes";

const initialState = {
  total: 0,
  page: 0
};

const filePaginationReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.INIT_FILE_TOTAL:
    return {
      total: action.total,
      page: 0
    };
  case actionTypes.FILE_NEXT_PAGE:
    return {
      ...state,
      page: state.page + 1
    };
  default:
    return state;
  }
};

export default filePaginationReducer;
