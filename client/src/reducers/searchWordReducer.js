const initialState = {
  value: ""
};

const searchWordReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "UPDATE_SEARCH_WORD":
    return { value: action.value };
  default:
    return state;
  }

};

export default searchWordReducer;
