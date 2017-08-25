const initialState = {
  loading: true
};

const dirTreeReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "LOADING_FETCH_DIR_TREE":
    return { loading: true };
  case "PUT_DIR_TREE":
    return {
      loading: false,
      node: action.node
    };
  default:
    return state;
  }
};

export default dirTreeReducer;
