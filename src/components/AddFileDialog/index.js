import React, { Component } from "react";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";

// DnD
import Dropzone from "react-dropzone";

class AddFileDialog extends Component {
  render() {
    const styles = {
      dropzone: {
        width: "80%",
        height: "80%",
        borderStyle: "dashed",
        borderColor: "gray",
        borderWidth: 3,
        padding: 50
      }
    };

    const onDrop = (files) => {
      files.forEach(f => {
        this.props.pushFileToBuffer(this.props.dir_id, f.name);
      });
    };

    const handleUpload = () => {
      this.props.filesBuffer.forEach(file => {
        this.props.addFile(this.props.dir_id, file.name);
        this.props.triggerSnackbar(`${file.name}をアップロードしました`);
      });
      this.setState(this.props.toggleAddFile);
      this.props.clearFilesBuffer();
    };

    const upload_button = <FileCloudUpload />;

    const actions = [
        <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.props.toggleAddFile}
        />,

      <FlatButton
        label="Upload"
        primary={true}
        keyboardFocused={true}
        onTouchTap={handleUpload}
        />,
    ];

    const renderFilesBuffer = () => {
      return this.props.filesBuffer.map( (f, idx) => {
        return <li key={idx}> {f.name} - {f.size} bytes</li>;
      });
    };

    return (
      <div>
        <MenuItem
          primaryText="ファイルをアップロード"
          leftIcon={upload_button}
          onTouchTap={this.props.toggleAddFile}
          />

        <Dialog
          title="ファイルをアップロード"
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.props.toggleAddFile}
          >
          <Dropzone onDrop={onDrop} style={styles.dropzone}>
            <p>クリックもしくはファイルをドロップ</p>
          </Dropzone>
          <ul>
            {renderFilesBuffer()}
          </ul>
        </Dialog>
      </div>
    );
  }
}

export default AddFileDialog;
