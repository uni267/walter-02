import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

const DeleteFileDialog = ({
  open,
  deleteFile,
  file,
  toggleDeleteFileDialog
}) => {
  const actions = [
    (
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={(e) => deleteFile(file)} />
    ),
    (
      <FlatButton
        label="close"
        primary={false}
        onTouchTap={toggleDeleteFileDialog}
        />
    )
  ];

  return (
    <Dialog
      title={`${file.name}を削除しますか？`}
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={toggleDeleteFileDialog}
      >
    </Dialog>
  );
};

DeleteFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  file: PropTypes.object
};

export default DeleteFileDialog;
