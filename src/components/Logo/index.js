import React, { Component } from "react";

// store
import { connect } from "react-redux";

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

    const toggleAccount = () => {
      this.props.dispatch({ type: "TOGGLE_ACCOUNT" });
    };

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
          <MenuItem primaryText="アカウント情報変更" onTouchTap={toggleAccount} />
          <Divider />
          <MenuItem primaryText="ログアウト" />
        </IconMenu>
      </div>
    );

    const toggleMenu = () => {
      this.props.dispatch({type: "TOGGLE_MENU"});
    };

    return (
      <div className="logo">
        <AppBar
          title={title}
          iconElementRight={right_elements}
          onLeftIconButtonTouchTap={toggleMenu}
          />
      </div>
    );
  }
}

Logo = connect()(Logo);
export default Logo;
