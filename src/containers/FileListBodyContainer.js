import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import FileListBody from "../components/FileListBody";

// actions
import {
  addFile,
  moveFile,
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
        deleteFile={this.props.deleteFile}
        deleteDirTree={this.props.deleteDirTree}
        editFile={this.props.editFile}
        triggerSnackbar={this.props.triggerSnackbar}
        toggleStar={this.props.toggleStar}
        addAuthority={this.props.addAuthority}
        deleteAuthority={this.props.deleteAuthority}
        roles={this.props.roles}
        users={this.props.users} />
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.roles,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  moveFile: (dir_id, file_id) =>  { dispatch(moveFile(dir_id, file_id)); },
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
