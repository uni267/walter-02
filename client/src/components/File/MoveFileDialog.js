import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

const MoveFileDialog = ({
  open,
  file,
  dir,
  moveFile,
  toggleMoveFileDialog
}) => {
  const actions = [
    (
      <FlatButton
        label="移動"
        onTouchTap={() => moveFile(dir, file)}
        primary={true}
        />
    ),
    (
      <FlatButton
        label="close"
        onTouchTap={toggleMoveFileDialog}
        />
    )
  ];

  return (
    <Dialog
      title="ファイルを移動"
      open={open}
      modal={false}
      actions={actions} >

      <DirTreeContainer />

    </Dialog>
  );
};

MoveFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  dir: PropTypes.object,
  moveFile: PropTypes.func.isRequired
};

export default MoveFileDialog;
