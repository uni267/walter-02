import NOTIFICATIONS from "../mock-notifications";

const notificationsReducer = (state = NOTIFICATIONS, action) => {
  switch (action.type) {
  case "SHOW_ALL":
    return state;
  default:
    return state;
  }
};

export default notificationsReducer;
