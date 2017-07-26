const selectedDirReducer = (state = {id: null}, action) => {
  switch (action.type) {
  case "SELECT_DIR_TREE":
    return action.dir;
  default: 
    return state;
  }
};

export default selectedDirReducer;
