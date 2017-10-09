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
  addAuthorityToFile,
  deleteAuthorityToFile,
  triggerSnackbar,
  handleClose
}) => {
  const actions = (
    <FlatButton
      label="close"
      onTouchTap={handleClose}
      />
  );
  
  return (
    <Dialog
      title="権限を変更"
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={handleClose} >

      <Authority
        file={dir}
        users={users}
        roles={roles}
        addAuthorityToFile={addAuthorityToFile}
        deleteAuthorityToFile={deleteAuthorityToFile}
        triggerSnackbar={triggerSnackbar} />

    </Dialog>
  );
};

AuthorityDirDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  dir: PropTypes.object,
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  addAuthorityToFile: PropTypes.func.isRequired,
  deleteAuthorityToFile: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default AuthorityDirDialog;
