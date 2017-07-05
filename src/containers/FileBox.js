import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material grid
import { Row, Col } from 'react-flexbox-grid';

// app components
import FileAction from "../components/FileAction";
import FileSearch from "../components/FileSearch";
import DirBox from "../components/DirBox";
// import FileList from "../components/FileList";
import FileListHeader from "../components/FileListHeader";
import FileListBody from "../components/FileListBody";
import FileSnackbar from "../components/FileSnackbar";

class FileBox extends Component {
  render() {
    const { files, dir_id, snackbar } = this.props;

    // @todo visibilityFilterで実装する
    const _files = files.filter(file => {
      return (file.is_display && Number(file.dir_id) === Number(dir_id));
    });

    const _dirs = files.filter(f => f.is_dir)
          .filter(f => Number(f.id) <= Number(dir_id))
          .sort( (a, b) => a.id > b.id);

    return (
      <div className="file-box">
        <Row>
          <Col xs={9} sm={9} md={9} lg={9}>
            <DirBox dirs={_dirs} />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FileSearch />
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
            <FileAction dir_id={dir_id} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    files: state.files,
    snackbar: state.snackbar
  };
};

const FileBoxContainer = connect(mapStateToProps)(FileBox);
export default FileBoxContainer;
