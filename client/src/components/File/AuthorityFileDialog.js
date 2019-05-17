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
  groups,
  roles,
  actions,
  session
}) => {
  const dialogActions = (
    <FlatButton
      label="閉じる"
      primary={true}
      onTouchTap={actions.toggleAuthorityFileDialog}
      />
  );

  return (
    <Dialog
      title="権限を変更"
      modal={false}
      actions={dialogActions}
      open={open}
      autoScrollBodyContent={true}
      onRequestClose={actions.toggleAuthorityFileDialog} >

      <Authority
        file={file}
        users={users}
        groups={groups}
        roles={roles}
        addAuthorityToFile={actions.addAuthorityToFile}
        deleteAuthorityToFile={actions.deleteAuthorityToFile}
        triggerSnackbar={actions.triggerSnackbar}
        session={session} />

    </Dialog>
  );
};

AuthorityFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  file: PropTypes.object,
  users: PropTypes.array.isRequired,
  groups: PropTypes.array,
  roles: PropTypes.array.isRequired,
  actions: PropTypes.object
};

export default AuthorityFileDialog;
