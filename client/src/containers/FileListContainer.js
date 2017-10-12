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
import { DragSource, DropTarget } from "react-dnd";

// components
import FileListHeader from "../components/FileListHeader";

// dir components
import Dir from "../components/Dir";
import File from "../components/File";
import FileOperationDialogContainer from "./FileOperationDialogContainer";

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

const fileSource = {
  beginDrag(props) {
    return {
      file: props.file
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.moveFile(dropResult.dir, item.file);
    }
  }
};

const fileTarget = {
  drop(props) {
    return {
      dir: props.dir
    };
  }
};

class FileListContainer extends Component {
  componentWillMount() {
    this.props.requestFetchFiles(this.props.match.params.id, this.props.page);
    this.props.requestFetchMetaInfos(this.props.tenant.tenant_id);
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

  // onScroll pagination
  // @todo スクロール幅の算出方法を改善する
  onScroll = (e) => {
    const nextPageThreshold = 100 + (this.props.page + 1) * 30 * 40;

    if (window.pageYOffset > nextPageThreshold) {
      this.props.fileNextPage();
    }
  };

  // finderからdropのハンドラ
  handleFileDrop = (item, monitor) => {
    if (monitor) {
      this.props.uploadFiles(this.props.match.params.id, monitor.getItem().files);
    }
  }

  renderRow = (file, idx) => {
    const DirDroppable = DropTarget("file", fileTarget, (con, mon) => ({
      connectDropTarget: con.dropTarget(),
      isOver: mon.isOver(),
      canDrop: mon.canDrop()
    }))(Dir);

    const dirComponent = (
      <DirDroppable
        { ...this.props }
        key={idx} 
        dir={file}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        />
    );

    const FileDraggable = DragSource("file", fileSource, (con, mon) => ({
      connectDragSource: con.dragSource(),
      isDragging: mon.isDragging()
    }))(File);

    const fileComponent = (
      <FileDraggable
        { ...this.props }
        key={idx}
        rowStyle={styles.row}
        cellStyle={styles.tableRow}
        headers={headers}
        file={file}
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

        <FileOperationDialogContainer />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files,
    selectedDir: state.selectedDir,
    fileSortTarget: state.fileSortTarget,
    deleteFileState: state.deleteFile,
    dirTree: state.dirTree,
    tenant: state.tenant,
    metaInfo: state.metaInfo,
    total: state.filePagination.total,
    page: state.filePagination.page,
    downloadBlob: state.downloadFile,
    addAuthority: state.addAuthorityFile
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
  requestFetchMetaInfos: (tenant_id) => {
    dispatch(actions.requestFetchMetaInfos(tenant_id));
  },
  addMetaInfoToFile: (file, metaInfo, value) => {
    dispatch(actions.addMetaInfoToFile(file, metaInfo, value));
  },
  deleteMetaInfoToFile: (file, metaInfo) => { 
    dispatch(actions.deleteMetaInfoToFile(file, metaInfo));
  },
  toggleFileMetaInfoDialog: (file) => dispatch(actions.toggleFileMetaInfoDialog(file)),
  toggleFileCheck: (file) => dispatch(actions.toggleFileCheck(file)),
  toggleFileCheckAll: (value) => dispatch(actions.toggleFileCheckAll(value)),
  fileNextPage: () => dispatch(actions.fileNextPage()),
  downloadFile: (file) => dispatch(actions.downloadFile(file)),
  requestFetchRoles: (tenant_id) => dispatch(actions.requestFetchRoles(tenant_id)),
  requestFetchUsers: (tenant_id) => dispatch(actions.requestFetchUsers(tenant_id)),
  toggleAuthorityFileDialog: (file) => {
    dispatch(actions.toggleAuthorityFileDialog(file));
  },
  toggleCopyDirDialog: () => dispatch(actions.toggleCopyDirDialog()),
  toggleDeleteDirDialog: (dir) => dispatch(actions.toggleDeleteDirDialog(dir)),
  toggleAuthorityDirDialog: (dir) => dispatch(actions.toggleAuthorityDirDialog(dir)),
  toggleMoveFileDialog: (file) => dispatch(actions.toggleMoveFileDialog(file)),
  toggleCopyFileDialog: (file) => dispatch(actions.toggleCopyFileDialog(file)),
  toggleHistoryFileDialog: (file) => dispatch(actions.toggleHistoryFileDialog(file)),
  toggleFileTagDialog: (file) => dispatch(actions.toggleFileTagDialog(file))
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
