import React, { Component } from "react";
import PropTypes from "prop-types";

// material
import AppBar from "material-ui/AppBar";
import IconMenu from "material-ui/IconMenu";
import IconButton from 'material-ui/IconButton';
import MenuItem from "material-ui/MenuItem";
import ActionAccountCircle from "material-ui/svg-icons/action/account-circle";
import Divider from 'material-ui/Divider';
import Avatar from "material-ui/Avatar";
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Dialog from "material-ui/Dialog";
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";

// router
import { Link } from "react-router-dom";

// components
import AccountDialog from "../Account/AccountDialog";
import AppMenu from "../AppMenu";

const styles = {
  smallIcon: {
    color: "white"
  },
  title: {
    textDecoration: "none",
    color: "white"
  }
};

const menus = [
  {name: "ファイル一覧"},
  {name: "管理コンソール"},
];

class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: {
        open: false
      },
      account: {
        open: false
      }
    };
  }

  toggleAppMenu = () => {
    this.setState({
      menu: {
        open: !this.state.menu.open
      }
    });
  };

  handleAccountClose = () => {
    this.setState({
      account: { open: false }
    });
  };

  renderRightElements = () => {

    const notificationIcon = (
      <IconButton iconStyle={styles.smallIcon}>
        <NotificationsIcon />
      </IconButton>
    );

    const accountIcon = (
      <IconButton iconStyle={styles.smallIcon}>
        <ActionAccountCircle />
      </IconButton>
    );

    const avatarIcon = (
      <Avatar src="/images/shikata.jpg" />
    );

    const renderNotification = (notification, idx) => {
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
      <div style={{paddingRight: 70}}>
        <Badge
          badgeContent={this.props.notifications.length}
          style={{padding: 5}}
          secondary={true} >

          <IconMenu
            iconButtonElement={notificationIcon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            {this.props.notifications.map(
            (notification, idx) => renderNotification(notification, idx))}

          </IconMenu>
        </Badge>

        <IconMenu
          iconButtonElement={accountIcon}
          anchorOrigin={{horizontal: "left", vertical: "bottom"}}>
          <MenuItem primaryText="user01" leftIcon={avatarIcon} disabled={true} />
          <Divider />
          <MenuItem
            primaryText="アカウント情報変更"
            onTouchTap={() => this.setState({ account: { open: true } })} />
          <Divider />
          <MenuItem primaryText="ログアウト" />
        </IconMenu>
      </div>
    );
  }

  render() {
    const title = (
      <Link to={`/home/`} style={styles.title}>
        cloud storage
      </Link>
    );

    return (
      <div className="logo">
        <AppBar
          title={title}
          iconElementRight={this.renderRightElements()}
          onLeftIconButtonTouchTap={this.toggleAppMenu} />

        <AppMenu
          open={this.state.menu.open}
          menus={menus}
          toggle={this.toggleAppMenu}
          />

        <AccountDialog
          open={this.state.account.open}
          handleClose={this.handleAccountClose} />
        
      </div>
    );
  }
}

Logo.propTypes = {
  notifications: PropTypes.array
};

export default Logo;
