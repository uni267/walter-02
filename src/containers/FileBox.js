import React, { Component } from "react";

// store
import { connect } from "react-redux";

// material grid
import { Row, Col } from 'react-flexbox-grid';

// app components
import FileAction from "../components/FileBox/FileAction";
import FileSearch from "../components/FileBox/FileSearch";
import DirBox from "../components/FileBox/DirBox";
import FileList from "../components/FileBox/FileList";

class FileBox extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    const { files, dir_id } = this.props;

    const _files = files.filter(file => {
      return (file.is_display && Number(file.dir_id) === Number(dir_id));
    });

    return (
      <div className="file-box">
        <Row>
          <Col xs={9} sm={9} md={9} lg={9}>
            <DirBox files={files} dir_id={dir_id} />
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
            <FileList dir_id={dir_id} files={_files} />
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
    files: state.files
  };
};

const FileBoxContainer = connect(mapStateToProps)(FileBox);
export default FileBoxContainer;
