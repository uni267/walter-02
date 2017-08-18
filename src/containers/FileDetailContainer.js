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
  addTag,
  addMetaInfo,
  deleteMetaInfo,
  requestFetchFile
} from "../actions";

class FileDetailContainer extends Component {
  componentDidMount() {
    this.props.requestFetchFile(this.props.match.params.id);
  }

  componentWillReciveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.requestFetchFile(nextProps.match.params.id);
    }
  }

  render() {
    return (
      <div>
        <NavigationContainer />
        <FileDetail
          history={this.props.history}
          file={this.props.file}
          roles={this.props.roles}
          users={this.props.users}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar}
          editFile={this.props.editFile}
          deleteTag={this.props.deleteTag}
          addTag={this.props.addTag}
          addMetaInfo={this.props.addMetaInfo}
          deleteMetaInfo={this.props.deleteMetaInfo}
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
    file: state.file,
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
  addTag: (file_id, tag) => { dispatch(addTag(file_id, tag)); },
  addMetaInfo: (file, metaInfo) => { dispatch(addMetaInfo(file, metaInfo)); },
  deleteMetaInfo: (file, metaInfo) => { dispatch(deleteMetaInfo(file, metaInfo)); },
  requestFetchFile: (file_id) => { dispatch(requestFetchFile(file_id)); }
});

FileDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDetailContainer);

export default FileDetailContainer;
