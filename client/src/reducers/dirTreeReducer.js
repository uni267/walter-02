const initialState = {
  loading: true,
  selected: null
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
  case "SELECT_DIR_TREE":
    return {
      ...state,
      selected: action.dir._id
    };

  default:
    return state;
  }
};

export default dirTreeReducer;
