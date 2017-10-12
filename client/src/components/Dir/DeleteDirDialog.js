import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const DeleteDirDialog = ({
  dir,
  open,
  deleteDir,
  triggerSnackbar,
  toggleDeleteDirDialog
}) => {
  const actions = [
    (
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={() => deleteDir(dir)}
        />
    ),
    (
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={toggleDeleteDirDialog}
        />
    )
  ];

  return (
    <Dialog
      title={`${dir.name}を削除しますか？`}
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={toggleDeleteDirDialog}
      >
    </Dialog>
  );
};

DeleteDirDialog.propTypes = {
  dir: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  deleteDir: PropTypes.func.isRequired
};

export default DeleteDirDialog;
