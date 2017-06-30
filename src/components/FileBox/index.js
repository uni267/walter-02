import React, { Component } from "react";
/* import axios from "axios";*/
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Row, Col } from 'react-flexbox-grid';
import FileAction from "./FileAction/";
import FileSearch from "./FileSearch/";
import DirBox from "./DirBox/";
import FileList from "./FileList/";

import DIRS from "../../mock-dirs";
import FILES from "../../mock-files";

injectTapEventPlugin();

class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dirs: []
    };

    this.addFiles = this.addFiles.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
  }

  componentWillMount() {
    this.getFiles();
    this.getDirs();
  }

  getDirs() {
    /* const url = "http://localhost:3333/dirs";
     * axios.get(url)
     *      .then( res => this.setState({dirs: res.data}))
     *      .catch( err => console.log(err) );*/
    this.setState({dirs: DIRS});
  }

  getFiles() {
    /* const url = "http://localhost:3333/files";
     * axios.get(url)
     *      .then(res => this.setState({files: res.data}))
     *      .catch( err => console.log(err) );*/
    this.setState({files: FILES});
  }

  addFiles(files) {
    let next_file_id = this.state.files.slice().sort( (a, b) => a.id < b.id)[0].id;
    next_file_id++;

    let _files = this.state.files.slice();

    files.forEach(f => _files.push({id: next_file_id++, name: f.name}));
    this.setState({ files: _files });
  }

  deleteFile(e, file) {
    let _files = this.state.files.slice();
    _files = _files.filter(_file => _file.id !== file.id);
    this.setState({ files: _files });
  }

  render() {
    return (
      <div className="file-box">
        <Row>
          <Col xsOffset={10} xs={2}>
            <FileSearch />
          </Col>
        </Row>
        <Row>
          <DirBox dirs={this.state.dirs} />
        </Row>
        <Row>
          <Col xs={10} sm={10} md={10} lg={10}>
            <FileList
              files={this.state.files}
              onDeleteClick={this.deleteFile}
            />
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <FileAction addFiles={this.addFiles} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default FileBox;