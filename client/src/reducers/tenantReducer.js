const initialState = {
  tenant_id: null,
  name: null,
  dirId: null,
  trashDirId: null
};

const tenantReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "PUT_TENANT":
    return {
      ...state,
      tenant_id: action.tenant_id,
      name: action.name,
      dirId: action.dirId, 
      trashDirId: action.trashDirId
    };
  default:
    return state;
  }
};

export default tenantReducer;
