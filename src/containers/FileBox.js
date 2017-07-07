import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material grid
import { Row, Col } from 'react-flexbox-grid';

// components
import FileActionContainer from "./FileAction";
import FileSearch from "../components/FileSearch";
import DirBox from "../components/DirBox";
import FileListHeader from "../components/FileListHeader";
import FileListBody from "../components/FileListBody";
import FileSnackbar from "../components/FileSnackbar";

// actions
import {
  searchFile,
  setSortTarget,
  toggleSortTarget,
  sortFile,
  triggerSnackbar,
  closeSnackbar,
  addFile,
  moveFile
} from "../actions";

class FileBox extends Component {
  render() {
    let _files = this.props.files.slice();

    if (this.props.searchWord.value.trim() !== '') {
      const re = new RegExp(this.props.searchWord.value);

      _files = this.props.files.filter(file => {
        return file.name.match(re) !== null ||
          file.modified.match(re) !== null ||
          file.owner.match(re) !== null;
      }).filter(file => file.is_display);
    }

    return (
      <div className="file-box">
        <Row>
          <Col xs={9} sm={9} md={9} lg={9}>
            <DirBox dirs={this.props.dirs} />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FileSearch
              searchWord={this.props.searchWord}
              searchFile={this.props.searchFile} />
          </Col>
        </Row>
        <Row>
          <div>&nbsp;</div>
        </Row>
        <Row>
          <Col xs={9} sm={9} md={9} lg={9}>
            <FileListHeader
              setSortTarget={this.props.setSortTarget}
              toggleSortTarget={this.props.toggleSortTarget}
              fileSortTarget={this.props.fileSortTarget} 
              sortFile={this.props.sortFile} />

            <FileListBody
              dir_id={this.props.dir_id}
              files={_files}
              addFile={this.props.addFile}
              moveFile={this.props.moveFile}
              triggerSnackbar={this.props.triggerSnackbar}
              />

            <FileSnackbar
              closeSnackbar={this.props.closeSnackbar}
              snackbar={this.props.snackbar} />

          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FileActionContainer dir_id={this.props.dir_id} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    snackbar: state.snackbar,
    searchWord: state.searchFile,
    fileSortTarget: state.fileSortTarget,
    files: state.files.filter(f => f.is_display)
      .filter(f => Number(f.dir_id) === Number(ownProps.dir_id)),
    dirs: state.files.filter(f => f.is_dir)
      .filter(f => Number(f.id) <= Number(ownProps.dir_id))
      .sort( (a, b) => a.id > b.id)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  searchFile: (keyword) => { dispatch(searchFile(keyword)); },
  setSortTarget: (target) => { dispatch(setSortTarget(target)); },
  toggleSortTarget: () => { dispatch(toggleSortTarget()); },
  sortFile: (sorted, desc) => { dispatch(sortFile(sorted, desc)); },
  triggerSnackbar: (message) => { dispatch(triggerSnackbar(message)); },
  closeSnackbar: () => { dispatch(closeSnackbar()); },
  addFile: (dir_id, file_name) => { dispatch(addFile(dir_id, file_name)); },
  moveFile: (dir_id, file_id) => { dispatch(moveFile(dir_id, file_id)); }
});

const FileBoxContainer = connect(mapStateToProps, mapDispatchToProps)(FileBox);
export default FileBoxContainer;
