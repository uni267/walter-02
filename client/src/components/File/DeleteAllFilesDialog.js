import React from "react";
import PropTypes from "prop-types";

// material-ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

const DeleteAllFilesDialog = ({
  open,
  handleClose,
  deleteFiles,
  files
}) => {
  const actions = [
    (
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={(e) => deleteFiles(files)}
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
      title={`選択された${files.length}個のファイルを削除しますか？`}
      modal={false}
      actions={actions}
      open={open}
      onRequestClose={handleClose}
      >
    </Dialog>
  );

};

DeleteAllFilesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  deleteFiles: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired
};

export default DeleteAllFilesDialog;

