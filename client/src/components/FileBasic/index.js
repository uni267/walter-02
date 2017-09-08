import React from "react";
import PropTypes from "prop-types";

// material ui
import TextField from "material-ui/TextField";

const styles = {
  metaRow: {
    marginTop: 10,
    display: "flex"
  },
  metaCell: {
    marginRight: 20,
    width: "20%"
  }
};

const FileBasic = ({
  file,
  open,
  changeFileName
}) => {
  let fileNameText = null;

  const form = (
    <TextField
      ref={(input) => fileNameText = input}
      defaultValue={file.name}
      onKeyDown={ e => e.key === "Enter" ? changeFileName(fileNameText) : null }
      />
  );

  const view = (
    <div>{file.name}</div>
  );

  const fileName = open ? form : view;

  return (
    <div>
      <div style={styles.metaRow}>
        <div style={styles.metaCell}>ファイル名</div>
        {fileName}
      </div>
      <div style={styles.metaRow}>
        <div style={styles.metaCell}>サイズ</div>
        <div>10.0KB</div>
      </div>
      <div style={styles.metaRow}>
        <div style={styles.metaCell}>最終更新</div>
        <div>{file.modified}</div>
      </div>
    </div>
  );
};

FileBasic.propTypes = {
  file: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  changeFileName: PropTypes.func.isRequired
};

export default FileBasic;
