import React, { Component } from "react";
import PropTypes from "prop-types";

// store
import { connect } from "react-redux";

// router
import { withRouter } from "react-router-dom";

// material
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import FileCloudUpload from "material-ui/svg-icons/file/cloud-upload";
import FileCreateNewFolder from "material-ui/svg-icons/file/create-new-folder";

// material icons
import ActionDelete from "material-ui/svg-icons/action/delete";
import ContentContentCopy from "material-ui/svg-icons/content/content-copy";
import ContentContentCut from "material-ui/svg-icons/content/content-cut";

// components
import AddFileDialog from "../components/AddFileDialog";
import AddDirDialog from "../components/AddDirDialog";
import MoveFileDialog from "../components/File/MoveFileDialog";
import DeleteAllFilesDialog from "../components/File/DeleteAllFilesDialog";

// actions
import * as actions from "../actions";

class FileActionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFile: {
        open: false
      }
    };
  }

  moveFiles = (files) => {
    this.props.moveFiles(this.props.selectedDir, files);
  };

  render() {
    let items = [
      (
        <MenuItem
          primaryText="アップロード"
          leftIcon={<FileCloudUpload />}
          onTouchTap={() => this.setState({ addFile: { open: true } })}
          />
      ),
      (
        <MenuItem
          primaryText="新しいフォルダ"
          leftIcon={<FileCreateNewFolder />}
          onTouchTap={this.props.toggleCreateDir}
          />
      ),
      (
        <MenuItem
          primaryText="ごみ箱"
          leftIcon={<ActionDelete />}
          onTouchTap={() => {
            this.props.history.push(`/home/${this.props.tenant.trashDirId}`);
          }}
          />
      )
    ];

    if (this.props.checkedFiles.length > 0) {
      items = [ ...items,
        [
          (
            <MenuItem
              primaryText="移動"
              onTouchTap={this.props.toggleMoveFilesDialog}
              leftIcon={<ContentContentCut />}
              />
          ),
          (
            <MenuItem
              primaryText="コピー"
              leftIcon={<ContentContentCopy />}
              />
          ),
          (
            <MenuItem
              primaryText="削除"
              leftIcon={<ActionDelete />}
              onTouchTap={this.props.toggleDeleteFilesDialog}
              />
          )
        ]
      ];
    }
    return (
      <div style={{marginRight: 30}}>
        <Menu>
          {items.map( item => item )}
        </Menu>

        <AddFileDialog
          dir_id={this.props.match.params.id}
          open={this.state.addFile.open}
          closeDialog={() => this.setState({ addFile: { open: false } })}
          { ...this.props }
          />

          <AddDirDialog
            dir_id={this.props.dir_id}
            { ...this.props }
            />

          <MoveFileDialog
            open={this.props.moveFilesState.open}
            handleClose={this.props.toggleMoveFilesDialog}
            moveFile={this.moveFiles}
            file={this.props.checkedFiles} />

          <DeleteAllFilesDialog
            open={this.props.deleteFilesDialog.open}
            handleClose={this.props.toggleDeleteFilesDialog}
            deleteFiles={this.props.deleteFiles}
            files={this.props.checkedFiles}
            />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    checkedFiles: state.files.filter( file => file.checked ),
    filesBuffer: state.filesBuffer,
    roles: state.roles,
    users: state.users,
    createDirState: state.createDir,
    tenant: state.tenant,
    selectedDir: state.dirTree.selected,
    moveFilesState: state.moveFilesState,
    deleteFilesDialog: state.deleteFiles
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  createDir: (dir_name) => dispatch(actions.createDir(ownProps.dir_id, dir_name)),
  triggerSnackbar: (message) => dispatch(actions.triggerSnackbar(message)),
  pushFileToBuffer: (dir_id, file_name) => { 
    dispatch(actions.pushFileToBuffer(dir_id, file_name));
  },
  clearFilesBuffer: () => dispatch(actions.clearFilesBuffer()),
  addAuthority: (file_id, user, role) => {
    dispatch(actions.addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(actions.deleteAuthority(file_id, authority_id));
  },
  toggleCreateDir: () => dispatch(actions.toggleCreateDir()),
  uploadFiles: (dir_id, files) => dispatch(actions.uploadFiles(dir_id, files)),
  deleteFiles: (files) => dispatch(actions.deleteFiles(files)),
  moveFiles: (dir, files) => dispatch(actions.moveFiles(dir, files)),
  toggleMoveFilesDialog: () => dispatch(actions.toggleMoveFilesDialog()),
  toggleDeleteFilesDialog: () => dispatch(actions.toggleDeleteFilesDialog())
});

FileActionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileActionContainer);

FileActionContainer.propTypes = {
  dir_id: PropTypes.string.isRequired
};

export default withRouter(FileActionContainer);
