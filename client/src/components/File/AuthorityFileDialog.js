import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import Authority from "../Authority";

const AuthorityFileDialog = ({
  open,
  file,
  users,
  roles,
  addAuthorityToFile,
  deleteAuthorityToFile,
  triggerSnackbar,
  toggleAuthorityFileDialog
}) => {
  const actions = (
    <FlatButton
      label="閉じる"
      primary={true}
      onTouchTap={toggleAuthorityFileDialog}
      />
  );
  
  return (
    <Dialog
      title="権限を変更"
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={toggleAuthorityFileDialog} >

      <Authority
        file={file}
        users={users}
        roles={roles}
        addAuthorityToFile={addAuthorityToFile}
        deleteAuthorityToFile={deleteAuthorityToFile}
        triggerSnackbar={triggerSnackbar} />

    </Dialog>
  );
};

AuthorityFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  file: PropTypes.object,
  users: PropTypes.array.isRequired,
  roles: PropTypes.array.isRequired,
  addAuthorityToFile: PropTypes.func.isRequired,
  deleteAuthorityToFile: PropTypes.func.isRequired
};

export default AuthorityFileDialog;
