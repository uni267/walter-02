import React, { Component } from "react";

// material
import AppBar from "material-ui/AppBar";
import IconMenu from "material-ui/IconMenu";
import IconButton from 'material-ui/IconButton';
import MenuItem from "material-ui/MenuItem";
import ActionAccountCircle from "material-ui/svg-icons/action/account-circle";
import SocialNotificationsNone from "material-ui/svg-icons/social/notifications-none.js";
import Divider from 'material-ui/Divider';
import Avatar from "material-ui/Avatar";

class Logo extends Component {
  render() {
    const styles = {
      smallIcon: {
        width: 32,
        height: 32,
        color: "white"
      },

      small: {
        width: 55,
        height: 55,
        marginRight: 20
      }
    };

    const title = "walter";
    const account_icon = (
      <IconButton style={styles.small} iconStyle={styles.smallIcon}>
        <ActionAccountCircle />
      </IconButton>
    );

    const avatar_icon = (
      <Avatar src="images/shikata.jpg" />
    );

    const right_elements = (
      <div>
        <IconButton style={styles.small} iconStyle={styles.smallIcon}>
          <SocialNotificationsNone />
        </IconButton>
        <IconMenu
          iconButtonElement={account_icon}
          anchorOrigin={{horizontal: "left", vertical: "bottom"}}>
          <MenuItem primaryText="user01" leftIcon={avatar_icon} disabled={true} />
          <Divider />
          <MenuItem
            primaryText="アカウント情報変更"
            onTouchTap={this.props.onAccountClick} />
          <Divider />
          <MenuItem primaryText="ログアウト" />
        </IconMenu>
      </div>
    );

    return (
      <div className="logo">
        <AppBar
          title={title}
          iconElementRight={right_elements}
          onLeftIconButtonTouchTap={this.props.onMenuIconClick}
          />
      </div>
    );
  }
}

export default Logo;
