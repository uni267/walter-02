import React, { Component } from "react";
import PropTypes from "prop-types";

// router
import { withRouter } from "react-router-dom";

// store
import { connect } from "react-redux";

// DnD
import TableBodyWrapper from "../components/FileListBody/TableBodyWrapper";
import withDragDropContext from "../components/FileListBody/withDragDropContext";
import { NativeTypes } from "react-dnd-html5-backend";

// components
import FileListHeader from "../components/FileListHeader";

// dir components
import Dir from "../components/Dir";
import MoveDirDialog from "../components/Dir/MoveDirDialog";
import CopyDirDialog from "../components/Dir/CopyDirDialog";
import DeleteDirDialog from "../components/Dir/DeleteDirDialog";
import AuthorityDirDialog from "../components/Dir/AuthorityDirDialog";
import HistoryDirDialog from "../components/Dir/HistoryDirDialog";

// file components
import File from "../components/File";
import AuthorityFileDialog from "../components/File/AuthorityFileDialog";
import DeleteFileDialog from "../components/File/DeleteFileDialog";
import MoveFileDialog from "../components/File/MoveFileDialog";
import CopyFileDialog from "../components/File/CopyFileDialog";
import HistoryFileDialog from "../components/File/HistoryFileDialog";
import TagFileDialog from "../components/File/TagFileDialog";

// actions
import {
  moveFile,
  copyFile,
  deleteFile,
  editFileByIndex,
  triggerSnackbar,
  toggleStar,
  addAuthority,
  deleteAuthority,
  deleteDirTree,
  setSortTarget,
  toggleSortTarget,
  sortFile,
  requestFetchFiles,
  uploadFiles,
  toggleDeleteFileDialog,
  toggleMoveDirDialog
} from "../actions";

const styles = {
  row: {
    display: "flex",
    width: "95%",
    marginLeft: 30,
    borderBottom: "1px solid lightgray",
    backgroundColor: "inherit"
  },
  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: "left",
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit"
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: "left",
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    color: "rgb(158, 158, 158)",
    fontSize: 12,
    height: 48
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    textAlign: "left",
    fontFamily: "Roboto sans-serif",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    height: 70,
    color: "rgb(80, 80, 80)",
    fontSize: 13
  }
};

const headers = [
  {key: "checkbox", width: "5%", label: ""},
  {key: "name", width: "50%", label: "名前"},
  {key: "modified", width: "20%", label: "最終更新"},
  {key: "owner", width: "15%", label: "メンバー"},
  {key: false, width: "10%", label: "Action"},
];

const fileType = {
  histories: [],
  tags: []
};

class FileListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copyDirDialog: {
        open: false
      },
      deleteDirDialog: {
        open: false,
        dir: {}
      },
      authorityDirDialog: {
        open: false,
        dir: {}
      },
      historyDirDialog: {
        open: false,
        dir: {}
      },
      authorityFileDialog: {
        open: false,
        file: {}
      },
      deleteFileDialog: {
        open: false,
        file: {}
      },
      moveFileDialog: {
        open: false,
        file: {}
      },
      copyFileDialog: {
        open: false,
        file: {}
      },
      historyFileDialog: {
        open: false,
        file: fileType
      },
      tagFileDialog: {
        open: false,
        file: fileType
      }
    };
  }

  handleFileDrop = (item, monitor) => {
    if (monitor) {
      this.props.uploadFiles(this.props.dir_id, monitor.getItem().files);
    }
  }

  moveFile = (dir_id, file_id) => {
    this.props.moveFile(file_id, dir_id);
    this.props.triggerSnackbar("ファイルを移動しました");
  };

  toggleDeleteDirDialog = (dir = {}) => {
    this.setState({
      deleteDirDialog: {
        open: !this.state.deleteDirDialog.open,
        dir: dir
      }
    });
  };

  toggleAuthorityDirDialog = (dir = {}) => {
    this.setState({
      authorityDirDialog: {
        open: !this.state.authorityDirDialog.open,
        dir: dir
      }
    });
  };

  toggleCopyDirDialog = () => {
    this.setState({
      copyDirDialog: {
        open: !this.state.copyDirDialog.open
      }
    });
  };

  toggleHistoryDirDialog = (dir = {}) => {
    this.setState({
      historyDirDialog: {
        open: !this.state.historyDirDialog.open,
        dir: dir
      }
    });
  };

  toggleAuthorityFileDialog = (file = {}) => {
    this.setState({
      authorityFileDialog: {
        open: !this.state.authorityFileDialog.open,
        file: file
      }
    });
  };

  toggleMoveFileDialog = (file = {}) => {
    this.setState({
      moveFileDialog: {
        open: !this.state.moveFileDialog.open,
        file: file
      }
    });
  };

  toggleCopyFileDialog = (file = {}) => {
    this.setState({
      copyFileDialog: {
        open: !this.state.copyFileDialog.open,
        file: file
      }
    });
  };

  toggleHistoryFileDialog = (file = fileType) => {
    this.setState({
      historyFileDialog: {
        open: !this.state.historyFileDialog.open,
        file: file
      }
    });
  };

  toggleTagFileDialog = (file = fileType) => {
    this.setState({
      tagFileDialog: {
        open: !this.state.tagFileDialog.open,
        file: file
      }
    });
  };

  deleteDir = (dir) => {
    this.setState({ deleteDirDialog: { open: false } });
    this.props.deleteFile(dir);
    this.setState({ deleteDirDialog: { dir: {} } });
    this.props.triggerSnackbar(`${dir.name}を削除しました`);
  };

  moveFile = (file) => {
    this.props.moveFile(
      this.props.selectedDir.id, file.id
    );
    this.toggleMoveFileDialog();
    this.props.triggerSnackbar(`${file.name}を移動しました`);
  };

  copyFile = (file) => {
    this.props.copyFile(
      this.props.selectedDir.id, file
    );
    this.toggleCopyFileDialog();
    this.props.triggerSnackbar(`${file.name}をコピーしました`);
  };

  renderRow = (file, idx) => {
    const dirComponent = (
      <Dir 
        key={idx} 
        history={this.props.history}
        dir={file}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        triggerSnackbar={this.props.triggerSnackbar}
        editDir={this.props.editFileByIndex}
        handleMoveDir={this.props.toggleMoveDirDialog}
        handleCopyDir={this.toggleCopyDirDialog}
        handleDeleteDir={this.toggleDeleteDirDialog}
        handleAuthorityDir={this.toggleAuthorityDirDialog}
        handleHistoryDir={this.toggleHistoryDirDialog}
        />
    );

    const fileComponent = (
      <File
        key={idx}
        history={this.props.history}
        dir_id={this.props.dir_id}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        file={file}
        editFileByIndex={this.props.editFileByIndex}
        moveFile={this.props.moveFile}
        triggerSnackbar={this.props.triggerSnackbar}
        requestFetchFiles={this.props.requestFetchFiles}
        toggleStar={this.props.toggleStar}
        handleAuthorityFile={this.toggleAuthorityFileDialog}
        handleDeleteFile={this.props.toggleDeleteFileDialog}
        handleMoveFile={this.toggleMoveFileDialog}
        handleCopyFile={this.toggleCopyFileDialog}
        handleHistoryFile={this.toggleHistoryFileDialog}
        handleTagFile={this.toggleTagFileDialog}
        />
    );

    return file.is_dir ? dirComponent : fileComponent;
  };

  render() {
    const { FILE } = NativeTypes;

    const filterAuthorityDir = (file) => 
          file.id === this.state.authorityDirDialog.dir._id;

    const filterAuthorityFile = (file) => 
          file.id === this.state.authorityFileDialog.file._id;

    const filterHistoryDir = (file) => 
          file.id === this.state.historyDirDialog.dir._id;

    const filterTagFile = (file) =>
          file.id === this.state.tagFileDialog.file._id;

    return (
      <div>
        <div style={styles.row}>
          {headers.map( (header, idx) => {
            return (
              <FileListHeader
                key={idx} 
                header={header}
                style={styles.tableHeader}
                setSortTarget={this.props.setSortTarget}
                toggleSortTarget={this.props.toggleSortTarget}
                fileSortTarget={this.props.fileSortTarget}
                sortFile={this.props.sortFile}
                />
            );
          })}
        </div>

        <TableBodyWrapper
          accepts={[FILE]}
          onDrop={this.handleFileDrop}
          >

          {this.props.files.length === 0
            ? "フォルダが空です(デザインはこれから)"
            : this.props.files.map( (file, idx) => this.renderRow(file, idx) )
          }

        </TableBodyWrapper>

        <MoveDirDialog />

        <CopyDirDialog
          open={this.state.copyDirDialog.open}
          handleClose={this.toggleCopyDirDialog} />            

        <DeleteDirDialog
          dir={this.state.deleteDirDialog.dir}
          open={this.state.deleteDirDialog.open}
          deleteDir={this.deleteDir}
          handleClose={this.toggleDeleteDirDialog}
          triggerSnackbar={this.props.triggerSnackbar} />

        <AuthorityDirDialog
          open={this.state.authorityDirDialog.open}
          dir={this.props.files.filter(filterAuthorityDir)[0]}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar}
          handleClose={this.toggleAuthorityDirDialog} />

        <HistoryDirDialog
          open={this.state.historyDirDialog.open}
          dir={this.props.files.filter(filterHistoryDir)[0]}
          handleClose={this.toggleHistoryDirDialog} />

        <AuthorityFileDialog
          open={this.state.authorityFileDialog.open}
          handleClose={this.toggleAuthorityFileDialog}
          file={this.props.files.filter(filterAuthorityFile)[0]}
          users={this.props.users}
          roles={this.props.roles}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          triggerSnackbar={this.props.triggerSnackbar} />

        <DeleteFileDialog
          open={this.props.deleteFileState.open}
          handleClose={this.props.toggleDeleteFileDialog}
          deleteFile={this.props.deleteFile}
          file={this.props.deleteFileState.file} />

        <MoveFileDialog
          open={this.state.moveFileDialog.open}
          handleClose={this.toggleMoveFileDialog}
          moveFile={this.moveFile}
          file={this.state.moveFileDialog.file} />

        <CopyFileDialog
          open={this.state.copyFileDialog.open}
          handleClose={this.toggleCopyFileDialog}
          copyFile={this.copyFile}
          file={this.state.copyFileDialog.file} />

        <HistoryFileDialog
          open={this.state.historyFileDialog.open}
          handleClose={this.toggleHistoryFileDialog}
          file={this.state.historyFileDialog.file} />

        <TagFileDialog
          open={this.state.tagFileDialog.open}
          handleClose={this.toggleTagFileDialog}
          file={this.state.tagFileDialog.file} />

      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files,
    roles: state.roles,
    users: state.users,
    selectedDir: state.selectedDir,
    fileSortTarget: state.fileSortTarget,
    deleteFileState: state.deleteFile,
    dirTree: state.dirTree
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  moveFile: (dir_id, file_id) => { dispatch(moveFile(dir_id, file_id)); },
  copyFile: (dir_id, file) => { dispatch(copyFile(dir_id, file)); },
  deleteFile: (file) => { dispatch(deleteFile(file)); },
  deleteDirTree: (dir) => { dispatch(deleteDirTree(dir)); },
  editFileByIndex: (file) => { dispatch(editFileByIndex(file)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  toggleStar: (file) => { dispatch(toggleStar(file)); },
  addAuthority: (file_id, user, role) => {
    dispatch(addAuthority(file_id, user, role));
  },
  deleteAuthority: (file_id, authority_id) => {
    dispatch(deleteAuthority(file_id, authority_id));
  },
  setSortTarget: (target) => { dispatch(setSortTarget(target)); },
  toggleSortTarget: () => { dispatch(toggleSortTarget()); },
  sortFile: (sorted, desc) => { dispatch(sortFile(sorted, desc)); },
  requestFetchFiles: (dir_id) => { dispatch(requestFetchFiles(dir_id)); },
  uploadFiles: (dir_id, files) => { dispatch(uploadFiles(dir_id, files)); },
  toggleDeleteFileDialog: (file) => { dispatch(toggleDeleteFileDialog(file)); },
  toggleMoveDirDialog: (dir) => { dispatch(toggleMoveDirDialog(dir)); }
});

FileListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListContainer);

FileListContainer.propTypes = {
  dir_id: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired
};

export default withRouter(withDragDropContext(FileListContainer));
