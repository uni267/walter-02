import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Dropzone from "react-dropzone";

const AddFileDialog = ({
  files,
  open,
  handleClose,
  handleUpload,
  onDrop,
}) => {
  const styles = {
    dropzone: {
      width: "80%",
      height: "80%",
      borderStyle: "dashed",
      borderColor: "gray",
      borderWidth: 3,
      padding: 50,
    }
  };

  const actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={handleClose}
    />,

    <FlatButton
      label="Upload"
      primary={true}
      keyboardFocused={true}
      onTouchTap={handleUpload}
    />,
  ];

  return (
    <Dialog
      title="ファイルをアップロード"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
    >
    <section>
      <Dropzone onDrop={onDrop} style={styles.dropzone}>
        <p>クリックもしくはファイルをドロップ</p>
      </Dropzone>

      <aside>
        <ul>
          {files.map( (f, idx) => <li key={idx}>{f.name} - {f.size} bytes</li>)}
        </ul>
      </aside>
      </section>
      </Dialog>
  );
};

export default AddFileDialog;
