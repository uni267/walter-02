const initialState = {
  data: {
    belongs_to: []
  },
  changed: {
    belongs_to: []
  },
  errors: {}
};

const groupReducer = (state = initialState, action) => {
  switch ( action.type ) {

  case "INIT_GROUP":
    return {
      ...state,
      data: action.group,
      changed: action.group
    };

  case "CHANGE_GROUP_NAME":
    return {
      ...state,
      changed: {
        ...state.changed,
        name: action.name
      }
    };

  case "CHANGE_GROUP_DESCRIPTION":
    return {
      ...state,
      changed: {
        ...state.changed,
        description: action.description
      }
    };

  case "SAVE_GROUP_VALIDATION_ERROR":
    return {
      ...state,
      errors: action.errors
    };
  case "CLEAR_GROUP_VALIDATION_ERROR":
    return {
      ...state,
      errors: {}
    };
  default:
    return state;
  }
};

export default groupReducer;

