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
      title="File upload"
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
    >
    <section>
      <div className="dropzone">
        <Dropzone onDrop={onDrop}>
          <p>click or drop</p>
        </Dropzone>
      </div>
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
