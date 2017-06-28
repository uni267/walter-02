import React, { Component } from "react";
/* import axios from "axios";*/
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Row, Col } from 'react-flexbox-grid';

import FileAction from "./FileAction";
import FileSearch from "./FileSearch";
import DirBox from "./DirBox";
import FileList from "./FileList";

import DIRS from "../mock-dirs";
import FILES from "../mock-files";

injectTapEventPlugin();

class FileBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dirs: []
    }

    this.addFiles = this.addFiles.bind(this);
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

  onFileViewClick(e) {
    console.log(e.target.dataset.file);
  }

  addFiles(files) {
    let next_file_id = this.state.files.slice().sort( (a, b) => a.id < b.id)[0].id;
    next_file_id++;

    let _files = this.state.files.slice();

    files.forEach(f => _files.push({id: next_file_id++, name: f.name}));
    this.setState({ files: _files });
  }

  render() {
    return (
      <div className="file-box">
        <Row>
          <Col xsOffset={9} xs={3}>
            <FileAction addFiles={this.addFiles} />
          </Col>
        </Row>
        <Row>
          <Col xsOffset={9} xs={3}>
            <FileSearch />
          </Col>
        </Row>
        <DirBox dirs={this.state.dirs} />
        <FileList
          files={this.state.files}
          onViewClick={this.onFileViewClick}
        />
      </div>
    )
  }
}

export default FileBox;
