import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import FileListBody from "../components/FileListBody";

// actions
import {
  addFile,
  moveFile,
  copyFile,
  deleteFile,
  editFile,
  triggerSnackbar,
  toggleStar,
  addAuthority,
  deleteAuthority,
  deleteDirTree
} from "../actions";

class FileListBodyContainer extends Component {
  render() {
    return (
      <FileListBody
        dir_id={this.props.dir_id}
        files={this.props.files}
        addFile={this.props.addFile}
        moveFile={this.props.moveFile}
        copyFile={this.props.copyFile}
        deleteFile={this.props.deleteFile}
        deleteDirTree={this.props.deleteDirTree}
        editFile={this.props.editFile}
        triggerSnackbar={this.props.triggerSnackbar}
        toggleStar={this.props.toggleStar}
        addAuthority={this.props.addAuthority}
        deleteAuthority={this.props.deleteAuthority}
        roles={this.props.roles}
        users={this.props.users}
        selectedDir={this.props.selectedDir} />
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.roles,
    users: state.users,
    selectedDir: state.selectedDir
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  moveFile: (dir_id, file_id) => { dispatch(moveFile(dir_id, file_id)); },
  copyFile: (dir_id, file) => { dispatch(copyFile(dir_id, file)); },
  deleteFile: (file) => { dispatch(deleteFile(file)); },
  deleteDirTree: (dir) => { dispatch(deleteDirTree(dir)); },
  editFile: (file) => { dispatch(editFile(file)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  toggleStar: (file) => { dispatch(toggleStar(file)); },
  addAuthority: (file_id, user, role) => {
    dispatch(addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(deleteAuthority(file_id, authority_id));
  }
});

FileListBodyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListBodyContainer);

export default FileListBodyContainer;
