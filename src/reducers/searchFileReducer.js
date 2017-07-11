const searchFileReducer = (state = {value: ''}, action) => {
  switch (action.type) {
  case "SEARCH_FILE":
    return {
      value: action.value
    };
  default:
    return state;
  }
};

export default searchFileReducer;
