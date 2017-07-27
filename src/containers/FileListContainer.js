import React, { Component } from "react";

// store
import { connect } from "react-redux";

// components
import FileListHeader from "../components/FileListHeader";
import FileListBody from "../components/FileListBody";

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
    borderBottom: "1px solid lightgray"
  },
  cell: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 48,
    textAlign: "left",
    fontSize: 12,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    backgroundColor: "inherit",
    color: "rgb(158, 158, 158)"
  }
};

class FileListContainer extends Component {
  renderHeaders = () => {
    const headers = [
      {key: "checkbox", width: "5%", label: ""},
      {key: "name", width: "50%", label: "名前"},
      {key: "modified", width: "20%", label: "最終更新"},
      {key: "owner", width: "15%", label: "メンバー"},
      {key: false, width: "10%", label: "Action"},
    ];
    
    const renderHeader = (header, idx) => {
      return (
        <FileListHeader
          key={idx} 
          header={header}
          style={styles.cell}
          setSortTarget={this.props.setSortTarget}
          toggleSortTarget={this.props.toggleSortTarget}
          fileSortTarget={this.props.fileSortTarget}
          sortFile={this.props.sortFile}
          />
      );
    };

    return headers.map( (header, idx) => renderHeader(header, idx) );
  };

  render() {

    return (
      <div>
        <div style={styles.row}>
          {this.renderHeaders()}
        </div>

        <FileListBody
          dir_id={this.props.dir_id}
          files={this.props.files}
          addFile={this.props.addFile}
          moveFile={this.props.moveFile}
          copyFile={this.props.copyFile}
          deleteFile={this.props.deleteFile}
          deleteDirTree={this.props.deleteDirTree}
          editFile={this.props.editFile}
          triggerSnackbar={this.props.triggerSnackbar}
          toggleStar={this.props.toggleStar}
          addAuthority={this.props.addAuthority}
          deleteAuthority={this.props.deleteAuthority}
          roles={this.props.roles}
          users={this.props.users}
          selectedDir={this.props.selectedDir}
          />

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

export default FileListContainer;
