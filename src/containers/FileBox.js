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

import { searchFile } from "../actions";


class FileBox extends Component {
  render() {
    const { files, dir_id, snackbar, search } = this.props;

    let _files = files.filter(file => {
      return (file.is_display && Number(file.dir_id) === Number(dir_id));
    });

    const _dirs = files.filter(f => f.is_dir)
          .filter(f => Number(f.id) <= Number(dir_id))
          .sort( (a, b) => a.id > b.id);

    if (this.props.searchWord.value.trim() !== '') {
      const re = new RegExp(this.props.searchWord.value);

      _files = files.filter(file => {
        return file.name.match(re) !== null ||
          file.modified.match(re) !== null ||
          file.owner.match(re) !== null;
      }).filter(file => file.is_display);
    }

    return (
      <div className="file-box">
        <Row>
          <Col xs={9} sm={9} md={9} lg={9}>
            <DirBox dirs={_dirs} />
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
            <FileListHeader />
            <FileListBody dir_id={dir_id} files={_files} />
            <FileSnackbar state={snackbar} />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FileActionContainer dir_id={dir_id} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
    snackbar: state.snackbar,
    searchWord: state.searchFile
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  searchFile: (keyword) => { dispatch(searchFile(keyword)); }
});

const FileBoxContainer = connect(mapStateToProps, mapDispatchToProps)(FileBox);
export default FileBoxContainer;
