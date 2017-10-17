import React, { Component } from "react";
import PropTypes from "prop-types";

// router
import { withRouter } from "react-router-dom";

// store
import { bindActionCreators } from "redux";
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
import * as FileActions from "../actions/files";

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
    paddingLeft: 10,
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
  {key: "name",     width: "50%", label: "名前"},
  {key: "modified", width: "20%", label: "最終更新"},
  {key: "owner",    width: "15%", label: "メンバー"},
  {key: false,      width: "10%", label: "操作"},
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
      props.actions.moveFile(dropResult.dir, item.file);
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
    this.props.actions.requestFetchFiles(this.props.match.params.id);
    this.props.actions.requestFetchMetaInfos();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.props.actions.requestFetchFiles(nextProps.match.params.id);
    }

    if (this.props.page < nextProps.page) {
      this.props.actions.requestFetchFiles(
        nextProps.match.params.id,
        nextProps.page,
        nextProps.fileSortTarget.sorted,
        nextProps.fileSortTarget.desc
      );
    }

    if (this.props.fileSortTarget !== nextProps.fileSortTarget) {
      this.props.actions.requestFetchFiles(
        nextProps.match.params.id,
        null,
        nextProps.fileSortTarget.sorted,
        nextProps.fileSortTarget.desc
      );
    }
  }

  // onScroll pagination
  // @todo スクロール幅の算出方法を改善する
  onScroll = (e) => {
    const nextPageThreshold = 100 + (this.props.page + 1) * 30 * 40;

    if (
      window.pageYOffset > nextPageThreshold
      && this.props.files.length < this.props.total
    ) {
      this.props.actions.fileNextPage();
    }
  };

  // finderからdropのハンドラ
  handleFileDrop = (item, monitor) => {
    if (monitor) {
      this.props.actions.uploadFiles(
        this.props.match.params.id, monitor.getItem().files
      );
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
  actions: bindActionCreators(FileActions, dispatch)
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
