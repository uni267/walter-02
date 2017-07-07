import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import FileListBody from "../components/FileListBody";

// actions
import { addFile, moveFile, deleteFile, triggerSnackbar } from "../actions";

class FileListBodyContainer extends Component {
  render() {
    return (
      <FileListBody
        dir_id={this.props.dir_id}
        files={this.props.files}
        addFile={this.props.addFile}
        moveFile={this.props.moveFile}
        deleteFile={this.props.deleteFile}
        triggerSnackbar={this.props.triggerSnackbar} />
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  moveFile: (dir_id, file_id) =>  { dispatch(moveFile(dir_id, file_id)); },
  deleteFile: (file) => { dispatch(deleteFile(file)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); }
});

FileListBodyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListBodyContainer);

export default FileListBodyContainer;
