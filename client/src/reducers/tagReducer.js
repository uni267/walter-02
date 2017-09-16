const initialState = {
  data: {},
  changedTag: {},
  validationErrors: {}
};

const tagReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_TAG":
    return action.tag === undefined || action.tag._id === undefined
      ? initialState
      : {
        data: action.tag,
        changedTag: action.tag,
        validationErrors: {}
      };
  case "CHANGE_TAG_LABEL":
    return {
      ...state,
      changedTag: {
        ...state.changedTag,
        label: action.value
      }
    };
  case "CHANGE_TAG_COLOR":
    return {
      ...state,
      changedTag: {
        ...state.changedTag,
        color: action.value
      }
    };
  case "CHANGE_TAG_DESCRIPTION":
    return {
      ...state,
      changedTag: {
        ...state.changedTag,
        description: action.value
      }
    };
  case "SAVE_TAG_VALIDATION_ERROR":
    return {
      ...state,
      validationErrors: {
        ...state.validationErrors,
        ...action.errors
      }
    };
  default:
    return state;
  }
};

export default tagReducer;
