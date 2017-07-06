import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import Dialog from "material-ui/Dialog";
import FontIcon from "material-ui/FontIcon";
import FlatButton from 'material-ui/FlatButton';
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";

class Account extends Component {
  render() {
    const { account, dispatch } = this.props;

    const actions = [
        <FlatButton
      label="close"
      onTouchTap={() => dispatch({ type: "TOGGLE_ACCOUNT" })}
        />,
      <FlatButton
        label="save"
        primary={true}
        onTouchTap={() => dispatch({ type: "TOGGLE_ACCOUNT" })}
        />
        ];

    return (
      <Dialog
        title="アカウント情報変更"
        modal={true}
        actions={actions} 
        open={account.open}
        onRequestClose={() => dispatch({ type: "TOGGLE_ACCOUNT" })}
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

  Account = connect()(Account);
export default Account;
