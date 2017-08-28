const initialState = {
  loading: true,
  selected: null,
  move_dir: null,
  moveDirDialogOpen: false
};

const dirTreeReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "LOADING_FETCH_DIR_TREE":
    return { ...state, loading: true };
  case "PUT_DIR_TREE":
    return {
      ...state,
      loading: false,
      node: action.node
    };
  case "SELECT_DIR_TREE":
    return {
      ...state,
      selected: action.dir
    };
  case "TOGGLE_MOVE_DIR_DIALOG":
    console.log(action.dir);
    const move_dir = action.dir === undefined ? state.move_dir : action.dir;

    return {
      ...state,
      moveDirDialogOpen: !state.moveDirDialogOpen,
      move_dir: move_dir
    };
  default:
    return state;
  }
};

export default dirTreeReducer;
