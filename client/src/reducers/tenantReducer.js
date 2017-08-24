const initialState = {
  name: null,
  dirId: null
};

const tenantReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "PUT_TENANT":
    return {
      ...state,
      name: action.name,
      dirId: action.dirId, 
      trashDirId: action.trashDirId
    };
  default:
    return state;
  }
};

export default tenantReducer;
