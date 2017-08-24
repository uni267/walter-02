const initialState = {
  value: null
};

const searchWordReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "SEARCH_FILE":
    return { value: action.value };
  default:
    return state;
  }

};

export default searchWordReducer;
