import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material
import Menu from "material-ui/Menu";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";

// actions
import {
  toggleAddDir,
  createDir,
  triggerSnackbar,
  toggleAddFile,
  pushFileToBuffer,
  clearFilesBuffer,
  addFile
} from "../actions";

class FileActionContainer extends Component {

  render() {
    return (
      <div>
        <Menu>
          <AddFileDialog
            dir_id={this.props.dir_id}
            open={this.props.open_file}
            toggleAddFile={this.props.toggleAddFile}
            filesBuffer={this.props.filesBuffer}
            pushFileToBuffer={this.props.pushFileToBuffer}
            addFile={this.props.addFile}
            triggerSnackbar={this.props.triggerSnackbar}
            clearFilesBuffer={this.props.clearFilesBuffer}
            />
          <AddDirDialog
            dir_id={this.props.dir_id}
            toggleAddDir={this.props.toggleAddDir}
            createDir={this.props.createDir}
            open={this.props.open_dir}
            triggerSnackbar={this.props.triggerSnackbar}
            />
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    open_dir: state.addDir.open,
    open_file: state.addFile.open,
    filesBuffer: state.filesBuffer
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleAddDir: () => { dispatch(toggleAddDir()); },
  createDir: (dir_name) => { dispatch(createDir(ownProps.dir_id, dir_name)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  toggleAddFile: () => { dispatch(toggleAddFile()); },
  pushFileToBuffer: (dir_id, file_name) => { 
    dispatch(pushFileToBuffer(dir_id, file_name));
  },
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  clearFilesBuffer: () => { dispatch(clearFilesBuffer()); }
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

export default FileActionContainer;
