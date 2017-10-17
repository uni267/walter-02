import React from "react";
import PropTypes from "prop-types";

// material ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

const RestoreFileDialog = ({
  open,
  file,
  actions
}) => {
  const dialogActions = [
    (
      <FlatButton
        label="復元"
        onTouchTap={() => actions.restoreFile(file)}
        primary={true} />
    ),
    (
      <FlatButton
        label="閉じる"
        onTouchTap={() => actions.toggleRestoreFileDialog() } />
    )
  ];

  return (
    <Dialog
      title="ファイルを復元"
      open={open}
      modal={false}
      actions={dialogActions} >

      ファイルを復元しますか？
      
    </Dialog>
  );
};

RestoreFileDialog.propTypes = {
  
};

export default RestoreFileDialog;
