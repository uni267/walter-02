const initialState = {
  items: []
};

const fileDetailSearchReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_FILE_DETAIL_SEARCH_ITEMS":
    return {
      ...state,
      items: action.items
    };
  default:
    return state;
  }
};

export default fileDetailSearchReducer;
