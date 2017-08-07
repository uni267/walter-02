import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const DeleteDirDialog = ({
  dir,
  open,
  deleteDir,
  handleClose,
  triggerSnackbar
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
        onTouchTap={handleClose}
        />
    )
  ];

  return (
    <Dialog
      title={`${dir.name}を削除しますか？`}
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={handleClose}
      >
    </Dialog>
  );
};

DeleteDirDialog.propTypes = {
  
};

export default DeleteDirDialog;
