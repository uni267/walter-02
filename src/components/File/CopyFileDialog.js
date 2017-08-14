import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

const CopyFileDialog = ({
  open,
  handleClose,
  copyFile,
  file
}) => {
  const actions = [
    (
      <FlatButton
        label="コピー"
        onTouchTap={() => copyFile(file)}
        primary={true}
        />
    ),
    (
      <FlatButton
        label="close"
        onTouchTap={handleClose}
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