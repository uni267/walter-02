import React, { Component } from "react";

// store
import { connect } from "react-redux";

// actions
import * as actions from "../actions";

// components
import MoveDirDialog from "../components/Dir/MoveDirDialog";
import CopyDirDialog from "../components/Dir/CopyDirDialog";
import DeleteDirDialog from "../components/Dir/DeleteDirDialog";
import AuthorityDirDialog from "../components/Dir/AuthorityDirDialog";
import HistoryDirDialog from "../components/Dir/HistoryDirDialog";
import AuthorityFileDialog from "../components/File/AuthorityFileDialog";
import DeleteFileDialog from "../components/File/DeleteFileDialog";
import MoveFileDialog from "../components/File/MoveFileDialog";
import CopyFileDialog from "../components/File/CopyFileDialog";
import HistoryFileDialog from "../components/File/HistoryFileDialog";
import TagFileDialog from "../components/File/TagFileDialog";
import MetaInfoDialog from "../components/File/MetaInfoDialog";

class FileOperationDialogContainer extends Component {
  componentWillMount() {
    this.props.requestFetchRoles();
    this.props.requestFetchUsers();
    this.props.requestFetchMetaInfos();
  }

  render() {
    return (
      <div>
        <MoveDirDialog />
        <CopyDirDialog 
          { ...this.props }
          open={this.props.copyDirState.open}
          handleClose={this.props.toggleCopyDirDialog} />
        <DeleteDirDialog
          { ...this.props }
          open={this.props.deleteDirState.open}
          dir={this.props.deleteDirState.dir} />
        <AuthorityDirDialog
          { ...this.props }
          open={this.props.authorityDirState.open}
          roles={this.props.roles}
          users={this.props.users}
          dir={this.props.authorityDirState.dir} />
        <AuthorityFileDialog
          { ...this.props }
          open={this.props.authorityFileState.open}
          file={this.props.authorityFileState.file}
          users={this.props.users}
          roles={this.props.roles} />
        <DeleteFileDialog
          { ...this.props }
          open={this.props.deleteFileState.open}
          file={this.props.deleteFileState.file} />
        <MoveFileDialog
          { ...this.props }
          open={this.props.moveFileState.open}
          file={this.props.moveFileState.file}
          dir={this.props.selectedDir} />
        <CopyFileDialog
          { ...this.props }
          open={this.props.copyFileState.open}
          file={this.props.copyFileState.file}
          dir_id={this.props.selectedDir._id} />
        <HistoryFileDialog
          { ...this.props }
          open={this.props.fileHistoryState.open}
          file={this.props.fileHistoryState.file} />
        <TagFileDialog
          { ...this.props }
          open={this.props.fileTagState.open}
          file={this.props.fileTagState.file} />
        <MetaInfoDialog 
          { ...this.props }
          open={this.props.fileMetaInfoState.open}
          file={this.props.fileMetaInfoState.file}
          metaInfo={this.props.metaInfos} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    roles: state.roles.data,
    metaInfos: state.metaInfo.meta_infos,
    copyDirState: state.copyDir,
    deleteFileState: state.deleteFile,
    deleteDirState: state.deleteDir,
    authorityDirState: state.authorityDir,
    authorityFileState: state.authorityFile,
    moveFileState: state.moveFile,
    selectedDir: state.selectedDir,
    copyFileState: state.copyFile,
    fileHistoryState: state.fileHistory,
    fileTagState: state.fileTag,
    fileMetaInfoState: state.fileMetaInfo
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggleCopyDirDialog: () => dispatch(actions.toggleCopyDirDialog()),
  toggleDeleteDirDialog: () => dispatch(actions.toggleDeleteDirDialog()),
  deleteDir: (dir) => dispatch(actions.deleteFile(dir)),
  toggleAuthorityDirDialog: () => dispatch(actions.toggleAuthorityDirDialog()),
  requestFetchRoles: () => dispatch(actions.requestFetchRoles()),
  requestFetchUsers: () => dispatch(actions.requestFetchUsers()),
  requestFetchMetaInfos: () => dispatch(actions.requestFetchMetaInfos()),
  addAuthorityToFile: (file, user, role) => {
    dispatch(actions.addAuthorityToFile(file, user, role));
  },
  deleteAuthorityToFile: (file_id, authority_id) => {
    dispatch(actions.deleteAuthorityToFile(file_id, authority_id));
  },
  toggleAuthorityFileDialog: (file) => {
    dispatch(actions.toggleAuthorityFileDialog(file));
  },
  deleteFile: (file) => dispatch(actions.deleteFile(file)),
  toggleDeleteFileDialog: (file) => dispatch(actions.toggleDeleteFileDialog(file)),
  moveFile: (dir, file) => dispatch(actions.moveFile(dir, file)),
  toggleMoveFileDialog: () => dispatch(actions.toggleMoveFileDialog()),
  toggleCopyFileDialog: () => dispatch(actions.toggleCopyFileDialog()),
  copyFile: (dir_id, file) => dispatch(actions.copyFile(dir_id, file)),
  toggleHistoryFileDialog: () => dispatch(actions.toggleHistoryFileDialog()),
  toggleFileTagDialog: () => dispatch(actions.toggleFileTagDialog()),
  toggleFileMetaInfoDialog: (file) => dispatch(actions.toggleFileMetaInfoDialog(file)),
  addMetaInfoToFile: (file, metaInfo, value) => {
    dispatch(actions.addMetaInfoToFile(file, metaInfo, value));
  },
  deleteMetaInfoToFile: (file, metaInfo) => {
    dispatch(actions.deleteMetaInfoToFile(file, metaInfo));
  }
});

FileOperationDialogContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileOperationDialogContainer);

export default FileOperationDialogContainer;
