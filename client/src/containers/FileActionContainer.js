import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// router
import { Link } from "react-router-dom";

// material
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

// icon
import ActionDelete from "material-ui/svg-icons/action/delete";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";

// actions
import {
  createDir,
  toggleCreateDir,
  triggerSnackbar,
  pushFileToBuffer,
  clearFilesBuffer,
  addAuthority,
  deleteAuthority,
  fileUpload
} from "../actions";

class FileActionContainer extends Component {
  render() {
    const deleteIcon = (
      <ActionDelete />
    );

    return (
      <div style={{marginRight: 30}}>
        <Menu>
          <AddFileDialog
            dir_id={this.props.dir_id}
            filesBuffer={this.props.filesBuffer}
            pushFileToBuffer={this.props.pushFileToBuffer}
            triggerSnackbar={this.props.triggerSnackbar}
            clearFilesBuffer={this.props.clearFilesBuffer}
            fileUpload={this.props.fileUpload}
            />

          <AddDirDialog
            dir_id={this.props.dir_id}
            roles={this.props.roles}
            users={this.props.users}
            addAuthority={this.props.addAuthority}
            deleteAuthority={this.props.deleteAuthority}
            triggerSnackbar={this.props.triggerSnackbar}
            toggleCreateDir={this.props.toggleCreateDir}
            createDir={this.props.createDir}
            createDirState={this.props.createDirState}
            />

          <Link to={`/home/${this.props.tenant.trashDirId}`}
                style={{textDecoration: "none"}}>
            <MenuItem
              primaryText="ごみ箱"
              leftIcon={deleteIcon}
              />
          </Link>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    filesBuffer: state.filesBuffer,
    roles: state.roles,
    users: state.users,
    createDirState: state.createDir,
    tenant: state.tenant
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  createDir: (dir_name) => { dispatch(createDir(ownProps.dir_id, dir_name)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  pushFileToBuffer: (dir_id, file_name) => { 
    dispatch(pushFileToBuffer(dir_id, file_name));
  },
  clearFilesBuffer: () => { dispatch(clearFilesBuffer()); },
  addAuthority: (file_id, user, role) => {
    dispatch(addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(deleteAuthority(file_id, authority_id));
  },
  toggleCreateDir: () => { dispatch(toggleCreateDir()); },
  fileUpload: (dir_id, file) => { dispatch(fileUpload(dir_id, file)); }
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

FileActionContainer.propTypes = {
  dir_id: PropTypes.string.isRequired
};

export default FileActionContainer;
