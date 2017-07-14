import USERS from "../mock-users";

const usersReducer = (state = USERS, action) => {
  switch (action.type) {
  default:
    return state;
  }
};

export default usersReducer;
