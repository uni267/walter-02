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
  createDirTree,
  triggerSnackbar,
  pushFileToBuffer,
  clearFilesBuffer,
  addFile,
  addAuthority,
  deleteAuthority
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
            addFile={this.props.addFile}
            triggerSnackbar={this.props.triggerSnackbar}
            clearFilesBuffer={this.props.clearFilesBuffer}
            />
          <AddDirDialog
            dir_id={this.props.dir_id}
            roles={this.props.roles}
            users={this.props.users}
            addAuthority={this.props.addAuthority}
            deleteAuthority={this.props.deleteAuthority}
            allDirs={this.props.allDirs}
            createDir={this.props.createDir}
            createDirTree={this.props.createDirTree}
            triggerSnackbar={this.props.triggerSnackbar}
            />
          <Link to={"/home/?dir_id=9999"} style={{textDecoration: "none"}}>
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
    allDirs: state.files.filter(file => file.is_dir),
    roles: state.roles,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  createDir: (dir_name) => { dispatch(createDir(ownProps.dir_id, dir_name)); },
  createDirTree: (dir) => {
    dispatch(createDirTree({id: Number(ownProps.dir_id)}, dir));
  },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  pushFileToBuffer: (dir_id, file_name) => { 
    dispatch(pushFileToBuffer(dir_id, file_name));
  },
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  clearFilesBuffer: () => { dispatch(clearFilesBuffer()); },
  addAuthority: (file_id, user, role) => {
    dispatch(addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(deleteAuthority(file_id, authority_id));
  }
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

FileActionContainer.propTypes = {
  dir_id: PropTypes.number.isRequired
};

export default FileActionContainer;
