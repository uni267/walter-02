import React, { Component } from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";
import Tag from "../Tag";

const TagFileDialog = ({
  open,
  handleClose,
  file,
  addTag,
  deleteTag,
  triggerSnackbar
}) => {
  const actions = (
    <FlatButton
      label="close"
      primary={true}
      onTouchTap={handleClose}
      />
  );

  return (
    <Dialog
      title="タグ編集"
      open={open}
      modal={false}
      actions={actions} >

      {file !== undefined
        ? (
          <Tag 
            file={file}
            addTag={addTag}
            deleteTag={deleteTag}
            triggerSnackbar={triggerSnackbar} />
        )
       : null}

    </Dialog>
  );
};

TagFileDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  file: PropTypes.object,
  addTag: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired
};

export default TagFileDialog;
