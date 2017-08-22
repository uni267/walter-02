import React from "react";
import PropTypes from "prop-types";

// material ui
import { Card, CardHeader, CardText } from 'material-ui/Card';

const Notification = ({ notifications }) => {
  const render = (notification, idx) => {
    return (
      <Card key={idx}>
        <CardHeader
          title={notification.title}
          subtitle={notification.modified} />

        <CardText>{notification.body}</CardText>
      </Card>
    );
  };

  return (
    <div>
      {notifications.map((notification, idx) => render(notification, idx))}
    </div>
  );
};

Notification.propTypes = {
  notifications: PropTypes.array.isRequired
};

export default Notification;
