import * as actionTypes from "../actionTypes";
import NOTIFICATIONS from "../mock-notifications";

const notificationsReducer = (state = NOTIFICATIONS, action) => {
  switch (action.type) {
  case actionTypes.TOGGLE_NOTIFICATIONS:
    return state;
  default:
    return state;
  }
};

export default notificationsReducer;
