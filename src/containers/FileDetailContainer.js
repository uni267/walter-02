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
  triggerSnackbar
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
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); }
});

FileDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDetailContainer);

export default FileDetailContainer;
