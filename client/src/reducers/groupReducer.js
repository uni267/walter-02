const initialState = {
  belongs_to: []
};

const groupReducer = (state = initialState, action) => {
  switch ( action.type ) {
  case "INIT_GROUP":
    return action.group;
  default:
    return state;
  }
};

export default groupReducer;
