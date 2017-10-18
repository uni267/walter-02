import * as actionTypes from "../actionTypes";

const initialState = {
  preview_id: null,
  loading: false,
  body: null
};

const filePreviewReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case actionTypes.INIT_FILE_PREVIEW:
    return {
      ...state,
      preview_id: action.preview_id
    };
  case actionTypes.TOGGLE_LOADING_FILE_PREVIEW:
    return {
      ...state,
      loading: !state.loading
    };
  case actionTypes.INIT_FILE_PREVIEW_BODY:
    return action.body ? {
      ...state,
      body: action.body
    } : {
      ...state,
      body: null
    };
  default:
    return state;
  }
};

export default filePreviewReducer;
