import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from 'material-ui/FlatButton';

// components
import Account from "../Account";

const AccountDialog = ({
  open,
  handleClose
}) => {
  const actions = [
    (
      <FlatButton
        label="close"
        onTouchTap={handleClose}
        />
    ),
    (
      <FlatButton
        label="save"
        primary={true}
        onTouchTap={handleClose}
        />
    )
  ];

  return (
    <Dialog
      title="アカウント情報変更"
      modal={true}
      actions={actions}
      open={open}
      onRequestClose={handleClose}
      >

      <Account />
    </Dialog>
  );
};

AccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AccountDialog;
