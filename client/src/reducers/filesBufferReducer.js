const initialState = [];

const filesBufferReducer = (state = initialState, action) => {
  switch (action.type) {
  case "PUSH_FILE_TO_BUFFER":
    return [ ...state, action.file ];
  case "CLEAR_FILES_BUFFER":
    return initialState;
  default:
    return state;
  }
};

export default filesBufferReducer;

