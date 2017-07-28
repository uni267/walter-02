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
import Dir from "../components/Dir";
import File from "../components/File";

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
  sortFile
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
        dir={file}
        rowStyle={styles.row}
        cellStyle={cellStyle}
        headers={headers}
        triggerSnackbar={this.props.triggerSnackbar}
        editDir={this.props.editFile}
        deleteDir={this.props.deleteFile}
        deleteDirTree={this.props.deleteDirTree}
        addAuthority={this.props.addAuthority}
        deleteAuthority={this.props.deleteAuthority}
        roles={this.props.roles}
        users={this.props.users}
        selectedDir={this.props.selectedDir}
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
        moveFile={this.moveFile}
        copyFile={this.props.copyFile}
        deleteFile={this.props.deleteFile}
        editFile={this.props.editFile}
        triggerSnackbar={this.props.triggerSnackbar}
        toggleStar={this.props.toggleStar}
        addAuthority={this.props.addAuthority}
        deleteAuthority={this.props.deleteAuthority}
        roles={this.props.roles}
        users={this.props.users}
        selectedDir={this.props.selectedDir}
        />
    );

    return file.is_dir ? dirComponent : fileComponent;
  };

  render() {
    const { FILE } = NativeTypes;

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
  sortFile: (sorted, desc) => { dispatch(sortFile(sorted, desc)); }
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
