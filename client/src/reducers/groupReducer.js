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
      data: action.group,
      changed: action.group
    };

  case "CHANGE_GROUP_NAME":
    return {
      data: state.data,
      changed: {
        ...state.changed,
        name: action.name
      }
    };

  case "CHANGE_GROUP_DESCRIPTION":
    return {
      data: state.data,
      changed: {
        ...state.changed,
        description: action.description
      }
    };

  case "CHANGE_GROUP_NAME_VALIDATION_ERROR":
    return {
      data: state.data,
      changed: state.changed,
      errors: action.errors
    };
  default:
    return state;
  }
};

export default groupReducer;

