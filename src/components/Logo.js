import React, { Component } from "react";
import AppBar from "material-ui/AppBar";
import IconButton from 'material-ui/IconButton';
import ActionAccountCircle from "material-ui/svg-icons/action/account-circle";
import SocialNotificationsNone from "material-ui/svg-icons/social/notifications-none.js";

class Logo extends Component {
  render() {
    const styles = {
      smallIcon: {
        width: 32,
        height: 32,
        color: "white",
      },

      small: {
        width: 55,
        height: 55,
        marginRight: 20,
      }
    }

    const title = "walter";
    const right_elements = (
      <div>
      <IconButton style={styles.small} iconStyle={styles.smallIcon}>
      <SocialNotificationsNone />
      </IconButton>
      <IconButton style={styles.small} iconStyle={styles.smallIcon}>
      <ActionAccountCircle />
      </IconButton>
      </div>
    );

    const toggleSidebar = () => {
      console.log("toggle");
    }

    return (
      <div className="logo">
      <AppBar
      title={title}
      iconElementRight={right_elements}
      onLeftIconButtonTouchTap={this.props.toggleMenu}
      />
      </div>
    );
  }
}

export default Logo;
