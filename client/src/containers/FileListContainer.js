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
import MetaInfoDialog from "../components/File/MetaInfoDialog";

// actions
import * as actions from "../actions";

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

  componentWillMount() {
    this.props.requestFetchFiles(this.props.match.params.id, this.props.page);
    this.props.requestFetchMetaInfo(this.props.tenant.tenant_id);
    this.props.requestFetchRoles(this.props.tenant.tenant_id);
    this.props.requestFetchUsers(this.props.tenant.tenant_id);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.requestFetchFiles(nextProps.match.params.id, this.props.page);
    }

    if (this.props.page < nextProps.page) {
      this.props.requestFetchNextFiles(this.props.match.params.id, nextProps.page);
    }
  }

  onScroll = (e) => {
    const nextPageThreshold = 100 + (this.props.page + 1) * 30 * 40;

    if (window.pageYOffset > nextPageThreshold) {
      this.props.fileNextPage();
    }
  };

  handleFileDrop = (item, monitor) => {
    if (monitor) {
      this.props.uploadFiles(this.props.match.params.id, monitor.getItem().files);
    }
  }

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

  toggleMetaInfoDialog = (file = {}) => {
    this.setState({
      metaInfoDialog: {
        open: !this.state.metaInfoDialog.open,
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
    this.props.moveFile(this.props.selectedDir, file);
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
        { ...this.props }
        key={idx} 
        dir={file}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        handleCopyDir={this.toggleCopyDirDialog}
        handleDeleteDir={this.toggleDeleteDirDialog}
        handleAuthorityDir={this.toggleAuthorityDirDialog}
        handleHistoryDir={this.toggleHistoryDirDialog}
        editDir={this.props.editFileByIndex}
        />
    );

    const fileComponent = (
      <File
        { ...this.props }
        key={idx}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        file={file}
        handleAuthorityFile={this.toggleAuthorityFileDialog}
        handleMoveFile={this.toggleMoveFileDialog}
        handleCopyFile={this.toggleCopyFileDialog}
        handleHistoryFile={this.toggleHistoryFileDialog}
        handleTagFile={this.toggleTagFileDialog}
        />
    );

    return file.is_dir ? dirComponent : fileComponent;
  };

  renderFileIsEmpty = () => {
    return (
      <div style={styles.row}>
        <div style={styles.tableRow}></div>
        <div style={styles.tableRow}></div>
        <div style={styles.tableRow}>
          フォルダ内にファイルが存在しません
        </div>
      </div>
    );
  };

  render() {
    const { FILE } = NativeTypes;

    const filterHistoryDir = (file) => 
          file.id === this.state.historyDirDialog.dir._id;

    return (
      <div>
        <div style={styles.row}>
          {headers.map( (header, idx) => (
            <FileListHeader
              key={idx} 
              header={header}
              style={styles.tableHeader}
              { ...this.props } />
          ))}
        </div>

        <TableBodyWrapper
          accepts={[FILE]}
          onDrop={this.handleFileDrop}>

          <div style={{ paddingBottom: 30 }} >
            {this.props.files.length === 0
              ? this.renderFileIsEmpty()
              : this.props.files.map( (file, idx) => this.renderRow(file, idx) )}
          </div>

        </TableBodyWrapper>

        <MoveDirDialog />

        <CopyDirDialog
          open={this.state.copyDirDialog.open}
          handleClose={this.toggleCopyDirDialog} />            

        <DeleteDirDialog
          { ...this.props }
          dir={this.state.deleteDirDialog.dir}
          open={this.state.deleteDirDialog.open}
          deleteDir={this.deleteDir}
          handleClose={this.toggleDeleteDirDialog}
        />

        <AuthorityDirDialog
          { ...this.props }
          open={this.state.authorityDirDialog.open}
          handleClose={this.toggleAuthorityDirDialog}
        />

        <HistoryDirDialog
          open={this.state.historyDirDialog.open}
          dir={this.props.files.filter(filterHistoryDir)[0]}
          handleClose={this.toggleHistoryDirDialog}
        />

        <AuthorityFileDialog
          { ...this.props }
          file={this.props.addAuthority.file}
          open={this.props.addAuthority.open}
          handleClose={this.props.toggleAuthorityFileDialog}
        />

        <DeleteFileDialog
          { ...this.props }
          open={this.props.deleteFileState.open}
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

        <MetaInfoDialog
          open={this.props.metaInfo.dialog_open}
          handleClose={this.props.toggleMetaInfoDialog}
          file={this.props.metaInfo.target_file}
          metaInfo={this.props.metaInfo.meta_infos}
          addMetaInfo={this.props.addMetaInfo}
          deleteMetaInfo={this.props.deleteMetaInfo} />
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
    dirTree: state.dirTree,
    tenant: state.tenant,
    metaInfo: state.metaInfo,
    total: state.filePagination.total,
    page: state.filePagination.page,
    downloadBlob: state.downloadFile,
    addAuthority: state.addAuthority
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  moveFile: (dir, file) => dispatch(actions.moveFile(dir, file)),
  moveFiles: (dir, files) => dispatch(actions.moveFiles(dir, files)),
  copyFile: (dir_id, file) => dispatch(actions.copyFile(dir_id, file)),
  deleteFile: (file) => dispatch(actions.deleteFile(file)),
  deleteDirTree: (dir) => dispatch(actions.deleteDirTree(dir)),
  editFileByIndex: (file) => dispatch(actions.editFileByIndex(file)),
  triggerSnackbar: (message) => dispatch(actions.triggerSnackbar(message)),
  toggleStar: (file) => dispatch(actions.toggleStar(file)),
  addAuthorityToFile: (file, user, role) => {
    dispatch(actions.addAuthorityToFile(file, user, role));
  },
  deleteAuthorityToFile: (file_id, authority_id) => {
    dispatch(actions.deleteAuthorityToFile(file_id, authority_id));
  },
  setSortTarget: (target) => dispatch(actions.setSortTarget(target)),
  toggleSortTarget: () => dispatch(actions.toggleSortTarget()),
  sortFile: (sorted, desc) => dispatch(actions.sortFile(sorted, desc)),
  requestFetchFiles: (dir_id, page) => {
    dispatch(actions.requestFetchFiles(dir_id, page));
  },
  requestFetchNextFiles: (dir_id, page) => {
    dispatch(actions.requestFetchNextFiles(dir_id, page));
  },
  uploadFiles: (dir_id, files) => dispatch(actions.uploadFiles(dir_id, files)),
  toggleDeleteFileDialog: (file) => dispatch(actions.toggleDeleteFileDialog(file)),
  toggleMoveDirDialog: (dir) => dispatch(actions.toggleMoveDirDialog(dir)),
  requestFetchMetaInfo: (tenant_id) => {
    dispatch(actions.requestFetchMetaInfo(tenant_id));
  },
  addMetaInfo: (file, metaInfo, value) => {
    dispatch(actions.addMetaInfo(file, metaInfo, value));
  },
  deleteMetaInfo: (file, metaInfo) => { 
    dispatch(actions.deleteMetaInfo(file, metaInfo));
  },
  toggleMetaInfoDialog: (file) => dispatch(actions.toggleMetaInfoDialog(file)),
  toggleFileCheck: (file) => dispatch(actions.toggleFileCheck(file)),
  toggleFileCheckAll: (value) => dispatch(actions.toggleFileCheckAll(value)),
  fileNextPage: () => dispatch(actions.fileNextPage()),
  downloadFile: (file) => dispatch(actions.downloadFile(file)),
  requestFetchRoles: (tenant_id) => dispatch(actions.requestFetchRoles(tenant_id)),
  requestFetchUsers: (tenant_id) => dispatch(actions.requestFetchUsers(tenant_id)),
  toggleAuthorityFileDialog: (file) => {
    dispatch(actions.toggleAuthorityFileDialog(file));
  }
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
