import * as actionTypes from "../actionTypes";

const initState = {
  notifications:[],
  unread: 0
};

const notificationsReducer = (state = initState, action) => {
  switch (action.type) {
  case actionTypes.TOGGLE_NOTIFICATIONS:
    return state;
  case actionTypes.INIT_NOTIFICAITON:
    return {
      ...state,
      notifications: action.notifications,
      unread: action.count_unread
    };
  default:
    return state;
  }
};

export default notificationsReducer;
