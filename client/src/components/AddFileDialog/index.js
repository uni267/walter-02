import React, { Component } from "react";
import PropTypes from "prop-types";

import axios from "axios";

// material
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import ActionDelete from "material-ui/svg-icons/action/delete";

// DnD
import Dropzone from "react-dropzone";

const styles = {
  dialog: {
    width: "70%",
    maxWidth: "none"
  },
  dropzone: {
    width: "90%",
    height: "90%",
    borderStyle: "dashed",
    borderColor: "rgb(130, 130, 130)",
    borderWidth: 3,
    padding: 20,
    marginTop: 30,
    marginLeft: 15,
    textAlign: "center"
  },
  cloudIcon: {
    width: 70,
    height: 70,
    color: "rgb(170, 170, 170)",
    paddingBottom: 20
  },
  bufferWrapper: {
    marginTop: 30,
    marginLeft: 20
  },
  bufferRow: {
    width: "95%",
    display: "flex",
    borderBottom: "1px solid lightgray",
    paddingBottom: 10,
    paddingTop: 10
  },
  bufferCol: {
    display: "flex"
  },
  bufferMime: {
    display: "flex",
    margin: 0,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 188, 212)",
    color: "white"
  }
};

class AddFileDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFile: { open: false }
    };
  }

  onDrop = (files) => {
    files.forEach( file => this.props.fileUpload(this.props.dir_id, file) );
  };

  renderFilesBuffer = (file, idx) => {
    return (
      <div style={styles.bufferRow} key={idx}>
        <div style={{...styles.bufferCol, width: "30%"}}>
          <div style={styles.bufferMime}>
            {file.mime_type}
          </div>
        </div>
        <div style={{...styles.bufferCol, width: "50%", padding: 10}}>
          {file.name}
        </div>
        <div style={{...styles.bufferCol, width: "15%", padding: 10}}>
          {file.size} byte
        </div>
        <div style={{...styles.bufferCol, width: "5%", padding: 10}}>
          <ActionDelete
            onClick={() => console.log("fire")}
            />
        </div>
      </div>
    );
  };

  render() {
    const actions = [
      (
        <FlatButton
          label="Close"
          primary={true}
          onTouchTap={() => {
            this.props.clearFilesBuffer();
            this.setState({ addFile: { open: false } });
          }} />
      )
    ];

    return (
      <div>
        <MenuItem
          primaryText="アップロード"
          leftIcon={<FileCloudUpload />}
          onTouchTap={() => this.setState({ addFile: { open: true } })} />

          <Dialog
            title="ファイルをアップロード"
            actions={actions}
            modal={true}
            open={this.state.addFile.open}
            onRequestClose={() => this.setState({ addFile: { open: false } })}
            autoScrollBodyContent={true}
            contentStyle={styles.dialog}
            >

            <div>
              <Dropzone onDrop={this.onDrop} style={styles.dropzone}>
                <FileCloudUpload style={styles.cloudIcon} /><br />
                <div>
                  ファイルをドロップまたは<br /><br />
                  <RaisedButton primary={true} label="ファイルを選択" />
                </div>
              </Dropzone>
            </div>

            <div style={styles.bufferWrapper}>
              {this.props.filesBuffer.map(this.renderFilesBuffer)}
            </div>

          </Dialog>

      </div>
    );
  }
}

AddFileDialog.propTypes = {
  dir_id: PropTypes.string.isRequired,
  filesBuffer: PropTypes.array.isRequired,
  pushFileToBuffer: PropTypes.func.isRequired,
  addFile: PropTypes.func.isRequired,
  triggerSnackbar: PropTypes.func.isRequired,
  clearFilesBuffer: PropTypes.func.isRequired
};

export default AddFileDialog;
