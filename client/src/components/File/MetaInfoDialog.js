import React from "react";
import PropTypes from "prop-types";

// material ui
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

// components
import MetaInfo from "../MetaInfo";

const MetaInfoDialog = ({
  open,
  toggleFileMetaInfoDialog,
  file,
  metaInfo,
  addMetaInfoToFile,
  deleteMetaInfoToFile
}) => {
  const actions = (
    <FlatButton
      label="閉じる"
      primary={true}
      onTouchTap={toggleFileMetaInfoDialog}
      />
  );
  return (
    <Dialog
      title="メタ情報を編集"
      actions={actions}
      modal={false}
      open={open}
      autoScrollBodyContent={true}
      onRequestClose={toggleFileMetaInfoDialog} >

      <MetaInfo
        file={file}
        metaInfo={metaInfo}
        addMetaInfoToFile={addMetaInfoToFile}
        deleteMetaInfoToFile={deleteMetaInfoToFile} />

    </Dialog>
  );
};

MetaInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  metaInfo: PropTypes.array.isRequired,
  addMetaInfo: PropTypes.func.isRequired,
  deleteMetaInfo: PropTypes.func.isRequired
};

export default MetaInfoDialog;
