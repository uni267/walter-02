import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

// components
import DirTreeContainer from "../../containers/DirTreeContainer";

const MoveDirDialog = ({
  open,
  handleClose
}) => {
  const actions = [
    (
      <FlatButton
        label="移動"
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
      title="フォルダを移動"
      open={open}
      modal={false}
      autoScrollBodyContent={true}
      onRequestClose={handleClose}
      actions={actions} >

      <DirTreeContainer />

    </Dialog>
  );
};

MoveDirDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default MoveDirDialog;
