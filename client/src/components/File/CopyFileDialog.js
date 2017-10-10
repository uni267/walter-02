import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

const CopyFileDialog = ({
  open,
  toggleCopyFileDialog,
  copyFile,
  file,
  dir_id
}) => {
  const actions = [
    (
      <FlatButton
        label="コピー"
        onTouchTap={() => copyFile(dir_id, file)}
        primary={true}
        />
    ),
    (
      <FlatButton
        label="close"
        onTouchTap={toggleCopyFileDialog}
        />
    )
  ];

  return (
    <Dialog
      title="ファイルをコピー"
      open={open}
      modal={false}
      actions={actions} >

      <DirTreeContainer />

    </Dialog>
  );
};

CopyFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  copyFile: PropTypes.func.isRequired,
  file: PropTypes.object
};

export default CopyFileDialog;
