import React, { Component } from "react";

// store
import { connect } from "react-redux";

// containers
import NavigationContainer from "./NavigationContainer";

// components
import FileDetail from "../components/FileDetail";
import FileSnackbar from "../components/FileSnackbar";

// actions
import {
  addAuthority,
  deleteAuthority,
  triggerSnackbar,
  editFile,
  deleteTag,
  addTag
} from "../actions";

class FileDetailContainer extends Component {
  render() {
    return (
      <div>
        <NavigationContainer />
        <FileDetail
          file={this.props.file}
          roles={this.props.roles}
          users={this.props.users}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar}
          editFile={this.props.editFile}
          deleteTag={this.props.deleteTag}
          addTag={this.props.addTag}
          />
        <FileSnackbar
          closeSnackbar={this.props.closeSnackbar}
          snackbar={this.props.snackbar} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    file: state.files.filter(f => f.id === Number(ownProps.match.params.id))[0],
    roles: state.roles,
    users: state.users,
    snackbar: state.snackbar
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addAuthority: (file_id, user, role) => {
    dispatch(addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(deleteAuthority(file_id, authority_id));
  },
  editFile: (file) => { dispatch(editFile(file)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  deleteTag: (file_id, tag) => { dispatch(deleteTag(file_id, tag)); },
  addTag: (file_id, tag) => { dispatch(addTag(file_id, tag)); }
});

FileDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDetailContainer);

export default FileDetailContainer;
