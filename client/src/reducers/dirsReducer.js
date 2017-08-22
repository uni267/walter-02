import DIRS from "../mock-dirs";

const dirsReducer = (state = [], action) => {

  switch (action.type) {
  case "INIT_DIR":
    return action.dirs;
  default:
    return state;
  }
};

export default dirsReducer;
