import React, { Component } from "react";

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
  toggleAddDir,
  createDir,
  createDirTree,
  triggerSnackbar,
  toggleAddFile,
  pushFileToBuffer,
  clearFilesBuffer,
  addFile
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
            allDirs={this.props.allDirs}
            toggleAddDir={this.props.toggleAddDir}
            createDir={this.props.createDir}
            createDirTree={this.props.createDirTree}
            open={this.props.open_dir}
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
    open_dir: state.addDir.open,
    open_file: state.addFile.open,
    filesBuffer: state.filesBuffer,
    allDirs: state.files.filter(file => file.is_dir)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleAddDir: () => { dispatch(toggleAddDir()); },
  createDir: (dir_name) => { dispatch(createDir(ownProps.dir_id, dir_name)); },
  createDirTree: (dir) => {
    dispatch(createDirTree({id: Number(ownProps.dir_id)}, dir));
  },
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
