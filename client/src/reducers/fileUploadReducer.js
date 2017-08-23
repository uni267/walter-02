const initialState = {
  blob: null
};

const fileUploadReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "PUT_BINARY_FILE":
    return {
      ...state,
      blob: action.blob
    };
  default:
    return state;
  }
};

export default fileUploadReducer;
