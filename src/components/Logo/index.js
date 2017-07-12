import React, { Component } from "react";

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
import {Card, CardHeader, CardText} from 'material-ui/Card';

const title = "cloud storage";

const styles = {
  smallIcon: {
    color: "white"
  }
};

class Logo extends Component {
  render() {
    const account_icon = (
      <IconButton iconStyle={styles.smallIcon}>
        <ActionAccountCircle />
      </IconButton>
    );

    const avatar_icon = (
      <Avatar src="images/shikata.jpg" />
    );

    const notification_icon = (
      <IconButton iconStyle={styles.smallIcon}>
        <NotificationsIcon />
      </IconButton>
    );

    const right_elements = (
      <div style={{paddingRight: 70}}>
        <Badge
          badgeContent={this.props.notifications.length}
          style={{padding: 5}}
          secondary={true} >

          <IconMenu
            iconButtonElement={notification_icon}
            anchorOrigin={{horizontal: "left", vertical: "bottom"}}>

            {this.props.notifications.map( (n, idx) => {
              return (
                <Card key={n.id}>
                  <CardHeader
                    title={n.title}
                    subtitle={n.modified} />

                  <CardText>{n.body}</CardText>
                </Card>
              );
            })}
          </IconMenu>
        </Badge>

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
