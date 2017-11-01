import React from "react";
import PropTypes from "prop-types";

// router
import { Link } from "react-router-dom";

// material ui
import ActionAccountCircle from "material-ui/svg-icons/action/account-circle";
import AppBar from "material-ui/AppBar";
import Avatar from "material-ui/Avatar";
import Badge from 'material-ui/Badge';
import Divider from 'material-ui/Divider';
import IconMenu from "material-ui/IconMenu";
import IconButton from 'material-ui/IconButton';
import MenuItem from "material-ui/MenuItem";
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

// components
import Notification from "../Notification";

const style = {
  textDecoration: "none",
  color: "white"
};

const AppNavBar = ({
  appTitle,
  toggleMenu,
  notifications,
  handleAccountOpen,
  handleLogout,
  tenant,
  session
}) => {
  const renderRightElements = () => {
    const notificationIcon = (
      <IconButton iconStyle={{ color: "white" }}>
        <NotificationsIcon />
      </IconButton>
    );

    const accountIcon = (
      <IconButton iconStyle={{ color: "white" }}>
        <ActionAccountCircle />
      </IconButton>
    );

    const avatarIcon = (
      <Avatar src="/images/shikata.jpg" />
    );

    return (
      <div style={{paddingRight: 70}}>
        <Badge
          badgeContent={notifications.length}
          style={{padding: 5}}
          secondary={true} >

          <IconMenu
            iconButtonElement={notificationIcon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            <Notification notifications={notifications} />

          </IconMenu>
        </Badge>

        <IconMenu
          iconButtonElement={accountIcon}
          anchorOrigin={{horizontal: "left", vertical: "bottom"}}>
          <MenuItem
            primaryText={session.user_name}
            leftIcon={avatarIcon}
            disabled={true} />
          <Divider />
          <MenuItem
            primaryText="パスワード変更"
            onTouchTap={handleAccountOpen} />
          <Divider />
          <MenuItem
            onTouchTap={handleLogout}
            primaryText="ログアウト" />
        </IconMenu>
      </div>
    );

  };

  const title = (
    <Link to={`/home/${tenant.dirId}`} style={style}>{appTitle}</Link>
  );

  return (
    <AppBar 
      title={title}
      iconElementRight={renderRightElements()}
      onLeftIconButtonTouchTap={toggleMenu} />
  );
};

AppNavBar.propTypes = {
  appTitle: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  handleAccountOpen: PropTypes.func.isRequired
};

export default AppNavBar;
