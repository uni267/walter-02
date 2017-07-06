import React, { Component } from "react";

// material
import Dialog from "material-ui/Dialog";
import FontIcon from "material-ui/FontIcon";
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";

class Account extends Component {
  render() {
    const { account } = this.props;

    const actions = [
        <FlatButton
      label="close"
      onTouchTap={this.props.onAccountClick}
        />,
      <FlatButton
        label="save"
        primary={true}
        onTouchTap={this.props.onAccountClick}
        />
        ];

    return (
      <Dialog
        title="アカウント情報変更"
        modal={true}
        actions={actions} 
        open={account.open}
        onRequestClose={this.props.onAccountClick}
        >
        <TextField
          hintText=""
          floatingLabelText="current password"
          type="password"
          />

        <br />
        
        <TextField
          hintText=""
          floatingLabelText="new password"
          type="password"
          />

      </Dialog>
    );
  }
}

export default Account;
