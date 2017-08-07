import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

const CopyDirDialog = ({
  open,
  handleClose
}) => {
  const actions = [
    (
      <FlatButton
        label="コピー"
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
      title="フォルダをコピー"
      open={open}
      modal={false}
      actions={actions} >

      <DirTreeContainer />

    </Dialog>
  );
};

CopyDirDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default CopyDirDialog;
