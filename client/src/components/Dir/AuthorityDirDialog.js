import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// components
import Authority from "../Authority";

const AuthorityDirDialog = ({
  open,
  dir,
  users,
  roles,
  actions
}) => {
  const dialogActions = (
    <FlatButton
      label="close"
      onTouchTap={actions.toggleAuthorityDirDialog}
      />
  );
  
  return (
    <Dialog
      title="権限を変更"
      modal={false}
      actions={dialogActions}
      open={open}
      onRequestClose={actions.toggleAuthorityDirDialog} >

      <Authority
        file={dir}
        users={users}
        roles={roles}
        addAuthorityToFile={actions.addAuthorityToFile}
        deleteAuthorityToFile={actions.deleteAuthorityToFile}
        triggerSnackbar={actions.triggerSnackbar} />

    </Dialog>
  );
};

AuthorityDirDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  dir: PropTypes.object,
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  actions: PropTypes.object
};

export default AuthorityDirDialog;
