import React, { Component } from "react";
import PropTypes from "prop-types";

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
  addFile,
  moveFile,
  copyFile,
  deleteFile,
  editFile,
  triggerSnackbar,
  toggleStar,
  addAuthority,
  deleteAuthority,
  deleteDirTree,
  searchFile,
  setSortTarget,
  toggleSortTarget,
  sortFile,
  addTag,
  deleteTag
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
  }
};

const headers = [
  {key: "checkbox", width: "5%", label: ""},
  {key: "name", width: "50%", label: "名前"},
  {key: "modified", width: "20%", label: "最終更新"},
  {key: "owner", width: "15%", label: "メンバー"},
  {key: false, width: "10%", label: "Action"},
];

class FileListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveDirDialog: {
        open: false
      },
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
        file: {}
      },
      tagFileDialog: {
        open: false,
        file: {}
      }
    };
  }

  handleFileDrop = (item, monitor) => {
    if (monitor) {
      const droppedFiles = monitor.getItem().files;
      droppedFiles.forEach(file => {
        this.props.addFile(this.props.dir_id, file.name);
        this.props.triggerSnackbar(`${file.name}をアップロードしました`);
      });
    }
  }

  moveFile = (dir_id, file_id) => {
    this.props.moveFile(file_id, dir_id);
    this.props.triggerSnackbar("ファイルを移動しました");
  };

  renderHeader = (header, idx) => {
    
    const headerStyle = {
      ...styles.cell,
      color: "rgb(158, 158, 158)",
      fontSize: 12,
      height: 48
    };

    return (
      <FileListHeader
        key={idx} 
        header={header}
        style={headerStyle}
        setSortTarget={this.props.setSortTarget}
        toggleSortTarget={this.props.toggleSortTarget}
        fileSortTarget={this.props.fileSortTarget}
        sortFile={this.props.sortFile}
        />
    );

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

  toggleMoveDirDialog = () => {
    this.setState({
      moveDirDialog: {
        open: !this.state.moveDirDialog.open
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

  toggleDeleteFileDialog = (file = {}) => {
    this.setState({
      deleteFileDialog: {
        open: !this.state.deleteFileDialog.open,
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

  toggleHistoryFileDialog = (file = {}) => {
    this.setState({
      historyFileDialog: {
        open: !this.state.historyFileDialog.open,
        file: file
      }
    });
  };

  toggleTagFileDialog = (file = {}) => {
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

  deleteFile = (file) => {
    this.setState({ deleteFileDialog: { open: false } });
    this.props.deleteFile(file);
    this.setState({ deleteFileDialog: { file: {} } });
    this.props.triggerSnackbar(`${file.name}を削除しました`);
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
    const cellStyle = {
      ...styles.cell,
      height: 70,
      color: "rgb(80, 80, 80)",
      fontSize: 13
    };

    const dirComponent = (
      <Dir 
        key={idx} 
        history={this.props.history}
        dir={file}
        rowStyle={styles.row}
        cellStyle={cellStyle}
        headers={headers}
        triggerSnackbar={this.props.triggerSnackbar}
        editDir={this.props.editFile}
        handleMoveDir={this.toggleMoveDirDialog}
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
        cellStyle={cellStyle}
        headers={headers}
        file={file}
        editFile={this.props.editFile}
        triggerSnackbar={this.props.triggerSnackbar}
        toggleStar={this.props.toggleStar}
        handleAuthorityFile={this.toggleAuthorityFileDialog}
        handleDeleteFile={this.toggleDeleteFileDialog}
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
          file.id === this.state.authorityDirDialog.dir.id;

    const filterAuthorityFile = (file) => 
          file.id === this.state.authorityFileDialog.file.id;

    const filterHistoryDir = (file) => 
          file.id === this.state.historyDirDialog.dir.id;

    const filterTagFile = (file) =>
          file.id === this.state.tagFileDialog.file.id;

    return (
      <div>
        <div style={styles.row}>
          {headers.map( (header, idx) => this.renderHeader(header, idx) )}
        </div>

        <TableBodyWrapper
          accepts={[FILE]}
          onDrop={this.handleFileDrop}
          >

          {this.props.files.map( (file, idx) => this.renderRow(file, idx) )}

        </TableBodyWrapper>

        <MoveDirDialog
          open={this.state.moveDirDialog.open}
          handleClose={this.toggleMoveDirDialog} />

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
          open={this.state.deleteFileDialog.open}
          handleClose={this.toggleDeleteFileDialog}
          deleteFile={this.deleteFile}
          file={this.state.deleteFileDialog.file} />

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
          file={this.props.files.filter(filterTagFile)[0]}
          addTag={this.props.addTag}
          deleteTag={this.props.deleteTag}
          triggerSnackbar={this.props.triggerSnackbar} />

      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    roles: state.roles,
    users: state.users,
    selectedDir: state.selectedDir,
    searchWord: state.searchFile,
    fileSortTarget: state.fileSortTarget
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  moveFile: (dir_id, file_id) => { dispatch(moveFile(dir_id, file_id)); },
  copyFile: (dir_id, file) => { dispatch(copyFile(dir_id, file)); },
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
  },
  searchFile: (keyword) => { dispatch(searchFile(keyword)); },
  setSortTarget: (target) => { dispatch(setSortTarget(target)); },
  toggleSortTarget: () => { dispatch(toggleSortTarget()); },
  sortFile: (sorted, desc) => { dispatch(sortFile(sorted, desc)); },
  addTag: (file_id, tag) => { dispatch(addTag(file_id, tag)); },
  deleteTag: (file_id, tag) => { dispatch(deleteTag(file_id, tag)); }
});

FileListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListContainer);

FileListContainer.propTypes = {
  dir_id: PropTypes.number.isRequired,
  files: PropTypes.array.isRequired
};

export default withDragDropContext(FileListContainer);
