import React, { Component } from "react";
import PropTypes from "prop-types";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";

// DnD
import Dropzone from "react-dropzone";

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

class AddFileDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFile: { open: false }
    };
  }

  renderUploadFileDialog = () => {
    const handleUpload = () => {
      this.props.filesBuffer.forEach(file => {
        this.props.addFile(this.props.dir_id, file.name);
        this.props.triggerSnackbar(`${file.name}をアップロードしました`);
      });
      this.props.clearFilesBuffer();
      this.setState({ addFile: { open: false } });
    };

    const onDrop = (files) => {
      files.forEach(f => {
        this.props.pushFileToBuffer(this.props.dir_id, f.name);
      });
    };

    const renderFilesBuffer = () => {
      return this.props.filesBuffer.map( (f, idx) => {
        return <li key={idx}> {f.name} - {f.size} bytes</li>;
      });
    };

    const actions = [
      (
        <FlatButton
          label="Cancel"
          primary={true}
          onTouchTap={() => this.setState({ addFile: { open: false } })}
          />
      ),
      (
        <FlatButton
          label="Upload"
          primary={true}
          keyboardFocused={true}
          onTouchTap={handleUpload}
          />
      )
    ];

    return (
      <Dialog
        title="ファイルをアップロード"
        actions={actions}
        modal={false}
        open={this.state.addFile.open}
        onRequestClose={() => this.setState({ addFile: { open: false } })}
        >
        <Dropzone onDrop={onDrop} style={styles.dropzone}>
          <p>クリックもしくはファイルをドロップ</p>
        </Dropzone>
        <ul>
          {renderFilesBuffer()}
        </ul>
      </Dialog>
    );
  };

  render() {
    return (
      <div>
        <MenuItem
          primaryText="アップロード"
          leftIcon={<FileCloudUpload />}
          onTouchTap={() => this.setState({ addFile: { open: true } })} />

          {this.renderUploadFileDialog()}

      </div>
    );
  }
}

AddFileDialog.propTypes = {
  dir_id: PropTypes.number.isRequired,
  filesBuffer: PropTypes.array.isRequired,
  pushFileToBuffer: PropTypes.func.isRequired,
  addFile: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  clearFilesBuffer: PropTypes.func.isRequired
};

export default AddFileDialog;
