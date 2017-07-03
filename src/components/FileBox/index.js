import React, { Component } from "react";
/* import axios from "axios";*/
// import injectTapEventPlugin from 'react-tap-event-plugin';
import { Row, Col } from 'react-flexbox-grid';
import moment from "moment";
import FileAction from "./FileAction/";
import FileSearch from "./FileSearch/";
import DirBox from "./DirBox/";
import FileList from "./FileList/";

import FILES from "../../mock-files";

// injectTapEventPlugin();

class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dirs: []
    };

    this.addFiles = this.addFiles.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.sortFile = this.sortFile.bind(this);
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
    let DIRS = FILES.filter(f => f.is_dir);
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

    files.forEach(f => _files.push({
      id: next_file_id++,
      name: f.name,
      modified: moment().format("YYYY-MM-DD HH:mm"),
      owner: "user01",
      is_dir: false,
    }));

    this.setState({ files: _files });
  }

  deleteFile(e, file) {
    let _files = this.state.files.slice();
    _files = _files.filter(_file => _file.id !== file.id);
    this.setState({ files: _files });
  }

  sortFile(sort) {
    let _files = this.state.files.slice();

    _files = _files.sort((a, b) => {
      if (sort.desc) {
        return a[sort.sorted] > b[sort.sorted];
      }
      else {
        return a[sort.sorted] < b[sort.sorted];
      }
    });

    this.setState({ files: _files });
  }

  render() {
    return (
      <div className="file-box">
          <Row>
            <Col xs={9} sm={9} md={9} lg={9}>
              <DirBox dirs={this.state.dirs} />
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
              <FileList
                files={this.state.files}
                onDeleteClick={this.deleteFile}
                sortFile={this.sortFile}
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
