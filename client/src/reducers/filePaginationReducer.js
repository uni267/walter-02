const initialState = {
  total: 0,
  page: 0
};

const filePaginationReducer = (state = initialState, action) => {
  switch (action.type) {
  case "INIT_FILE_TOTAL":
    return {
      ...state,
      total: action.total
    };
  case "FILE_NEXT_PAGE":
    return {
      ...state,
      page: state.page + 1
    };
  default:
    return state;
  }
};

export default filePaginationReducer;
