import React, { Component } from "react";
/* import axios from "axios";*/
// import injectTapEventPlugin from 'react-tap-event-plugin';
import { Row, Col } from 'react-flexbox-grid';
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
      all_files: [],
      files: [],
      dirs: []
    };

    this.addFiles = this.addFiles.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.sortFile = this.sortFile.bind(this);
  }

  componentWillMount() {
    this.setState({all_files: FILES});
    this.getFiles(FILES);
    this.getDirs(FILES);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dir_id !== this.props.dir_id) {
      this.getFiles(this.state.all_files);
      this.getDirs(this.state.all_files);
    }
  }

  getDirs(files) {
    /* const url = "http://localhost:3333/dirs";
     * axios.get(url)
     *      .then( res => this.setState({dirs: res.data}))
     *      .catch( err => console.log(err) );*/
    const { dir_id } = this.props;
    let dirs = files.filter(f => f.is_dir)
        .filter(d => d.id <= Number(dir_id));

    this.setState({dirs: dirs});
  }

  getFiles(files) {
    /* const url = "http://localhost:3333/files";
     * axios.get(url)
     *      .then(res => this.setState({files: res.data}))
     *      .catch( err => console.log(err) );*/
    const { dir_id } = this.props;
    let _files = files
        .filter(file => file.dir_id === Number(dir_id))
        .filter(file => file.is_display);

    this.setState({files: _files});
  }

  addFiles(files) {
    let next_file_id = this.state.files.slice().sort( (a, b) => a.id < b.id)[0].id;
    next_file_id++;

    let _files = this.state.files.slice();
    let _all_files = this.state.all_files.slice();

    files.forEach(f => {
      const push_file = {...f, id: next_file_id++};
      _files.push(push_file);
      _all_files.push(push_file);
    });

    this.setState({ files: _files });
    this.setState({ all_files: _all_files });
  }

  deleteFile(e, file) {
    let _files = this.state.files.slice();
    let _all_files = this.state.all_files.slice();

    _files = _files.filter(_file => _file.id !== file.id);
    _all_files = _all_files.filter(_file => _file.id !== file.id);

    this.setState({ files: _files });
    this.setState({ all_files: _all_files });
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
            <FileAction
              addFiles={this.addFiles}
              dir_id={this.props.dir_id} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileBox;
